import type { LifeTimeObject } from "@plugins/three-base-experience";
import * as THREE from "three/webgpu"

export default class Earth implements LifeTimeObject{
  declare public mesh: THREE.Mesh
  declare material: THREE.MeshStandardNodeMaterial
  constructor() {
    this.mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());

    // Vector3 {x: -258.56545330625795, y: 36.516691153970484, z: -307.0037742142601}
    this.mesh.position.set(-258.56, 36.51, -307)
    this.mesh.receiveShadow = true;
  }
  createGeometry = () => {
    return new THREE.SphereGeometry(40, 200, 200)
  }
  createMaterial = () => {
    this.material = new THREE.MeshStandardNodeMaterial({
      color: "green"
    })
    return this.material;
  }
  init = () => {};
  update = () => {};
  destroy = () => {};
}
