import { Debug, Experience, StaticObject, type LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import { smoothstep } from "three/src/nodes/TSL.js";
import { atan, color, cos, deltaTime, float, mix, mrt, mx_fractal_noise_float, mx_noise_float, output, positionLocal, remap, sin, time, uniform, uv } from "three/tsl";
import * as THREE from "three/webgpu"


export default class Sun extends StaticObject {
  declare private debug: Debug
  declare private debugFolder: ParametersGroup
  declare material: THREE.MeshStandardNodeMaterial;

  /**
   * Palette
   */
  public red = color("#FF4200")
  public orange = color("#FF9300")
  public yellow = color("#FFAE00")

  /**
   * Uniforms
   */
  public offset = uniform(4.4)
  public spread = uniform(.35)
  public maskScale = uniform(.15)
  public speed = uniform(.1)
  public smoothBlend = uniform(.5)
  public emissiveIntensity = uniform(1.)

  /**
   * EXPLOSION
   */
  declare private explosionMesh: THREE.Mesh

  /**
   * Explosion uniforms
   */
  public ondulationSpeed = uniform(1.);
  public ondulationScale = uniform(1.);

  constructor() {
    super()
    this.init()
  }
  init = () => {
    super.init()
    this.mesh.position.set(-346.86, -26.50, -234.20)
    this.createExplosionMesh();
    this.setDebugObject()
  };
  setGeometry() {
    this.geometry = new THREE.SphereGeometry(50, 200, 200)
  }
  setMaterial() {
    this.material = new THREE.MeshStandardNodeMaterial()
    this.material.mrtNode = mrt({
      bloomIntensity: float(1.)
    })
    this.material.needsUpdate = true;
    const coords = positionLocal.remap(float(-1), float(1), float(0), float(1)).mul(float(this.maskScale))
    const blendFactor = remap(mx_fractal_noise_float(coords.add(time.mul(this.speed)), 2.).r, 0., 1., this.spread, 1.)
    // const color = smoothstep(0., .3, blendFactor)
    const maskMap = smoothstep(float(.5).sub(this.smoothBlend), float(.5).add(this.smoothBlend), blendFactor)
    this.material.emissiveNode = mix(this.red, this.yellow, maskMap).mul(this.emissiveIntensity)
  }
  setTextures(): void {

  }
  setMesh(): void {
    super.setMesh()
  }

  createExplosionMesh() {
    const geometry = new THREE.SphereGeometry(65, 50, 50)
    const material = new THREE.MeshBasicNodeMaterial();
    material.colorNode = uv();

    const radius = sin(mx_noise_float(positionLocal.add(time.mul(this.ondulationSpeed)))).mul(this.ondulationScale);
    atan
    positionLocal.x.addAssign(cos())
    material.positionNode = newPosNode

    this.explosionMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.explosionMesh)
    this.explosionMesh.position.copy(this.mesh.position);
  }

  setDebugObject = () => {
    if (!this.experience.debug.active) return;
    this.debug = this.experience.debug
    this.debugFolder = this.experience.debug.inspector.createParameters("🌞 Sun")
    this.debugFolder.add(this.offset, "value", 0., 10., .01).name("offset")
    this.debugFolder.add(this.spread, "value", 0., 1., .01).name("spread")
    this.debugFolder.add(this.maskScale, "value", 0., 5., .01).name("mask scale")
    this.debugFolder.add(this.speed, "value", 0., 10., .1).name("noise speed")
    this.debugFolder.add(this.smoothBlend, "value", 0., .5, .01).name("smooth blend")
    this.debugFolder.add(this.emissiveIntensity, "value", 0., 10., .01).name("emissive intensity")

    const explosionFolder = this.debugFolder.addFolder("Explosion");
    explosionFolder.add(this.ondulationSpeed, "value", 0., 10., .01).name("Ondulation Speed");
    explosionFolder.add(this.ondulationScale, "value", 0., 1000., .01).name("Ondulation Scale");
    //colors
    // this.debugFolder.addColor(this.red, "").name("color 1")

  }

  update = () => {};
  destroy = () => {};
}
