import { Actor, Experience, type LifeTimeObject } from "@plugins/three-base-experience";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cos, cross, dot, float, Fn, instancedArray, instanceIndex, normalize, oneMinus, PI, positionLocal, range, sin, sqrt, vec3, vec4 } from "three/tsl";
import type { StorageBufferNode } from "three/webgpu";
import * as THREE from "three/webgpu"

export default class Forest implements LifeTimeObject {
  public count = 100
  declare planetRadius : number
  declare center: THREE.Vector3
  declare experience: Experience

  constructor(planetRadius: number, center: THREE.Vector3) {
    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.planetRadius = planetRadius;
    this.center = center;
  }

  createForest = async () => {
    const tree = new Actor(
      "tree",
      this.experience.resources.items.treeModel2 as GLTF,
      false,
      false,
    );
    tree.model.castShadow = true
    tree.model.children[0].children.forEach((c) => {
      if (c instanceof THREE.Mesh) {
        const mat = c.material as THREE.MeshStandardMaterial
        mat.metalness = 0
        mat.roughness = 1
      }
    })
    const trunk = tree.model.children[0].children[0] as THREE.Mesh
    console.log(trunk)
    // const mesh2 = tree.model.children[0].children[1]

    const positions = instancedArray(100, 'vec3')
    const rotations = instancedArray(100, 'vec4')

    const computedNode = this.computeTreePositionAndRotation({ positions, rotations }).compute(this.count)
    const renderer = this.experience.renderer.instance as THREE.WebGPURenderer;
    await renderer.computeAsync(computedNode);
    const test = instancedArray(10, 'vec3')
    const testCompute = Fn(() => {
      test.element(instanceIndex).assign(vec3(1,1,1))
    })().compute(10)
    await this.experience.renderer.instance.computeAsync(testCompute)

    const instancePosition = positions.element(instanceIndex)
    const instanceRotation = rotations.element(instanceIndex)

    const oldMat = trunk.material as THREE.MeshStandardMaterial
    const material = new THREE.MeshStandardNodeMaterial().copy(oldMat);
    console.log(trunk.geometry)

    material.positionNode = this.rotateVectorByQuaternion(positionLocal, instanceRotation).add(instancePosition);
    const trunkInstance = new THREE.InstancedMesh(trunk.geometry, material, this.count)
    this.experience.scene.add(trunkInstance)
  }

  computeTreePositionAndRotation = Fn(({ positions, rotations}: {positions: StorageBufferNode<"vec3">, rotations: StorageBufferNode<"vec4">}) => {
    //this.tree.model.position.y = 0

    const theta = range(oneMinus(PI), PI)// (Math.random()-.5)*2.* Math.PI//range(oneMinus(PI), PI)//Math.PI / 180 * thetaStep * 360
    const phi = range(oneMinus(PI), PI)//range(oneMinus(PI), PI)//Math.PI / 180 * phiStep * 360;

    const normal = vec3(
       cos(phi).mul(cos(theta)),
       sin(phi),
       cos(phi).mul(sin(theta))
     );

    const worldPos = vec3(this.center.x, this.center.y, this.center.z)
      .add(normal.mul(this.planetRadius));

    const quaternion = this.quaternionFromUpToNormal(normal);

    // this.tree.model.quaternion.copy(quaternion);

    positions.element(instanceIndex).assign(worldPos);
    rotations.element(instanceIndex).assign(quaternion);
  })

  rotateVectorByQuaternion = Fn(([v, q]: [any, any]) => {
    const qv = q.xyz;
    const t = cross(qv, v).mul(2);
    return v.add(t.mul(q.w)).add(cross(qv, t));
  });

  quaternionFromUpToNormal = Fn(([normal]: [any]) => {
    const up = vec3(0, 1, 0);
    const d = dot(up, normal);
    const axis = cross(up, normal);
    const s = sqrt(float(1).add(d).mul(2));
    const invs = float(1).div(s);

    return vec4(axis.x.mul(invs), axis.y.mul(invs), axis.z.mul(invs), s.mul(0.5));
  });

  init = () => {};
  destroy = () => {};
  update = () => {};
}
