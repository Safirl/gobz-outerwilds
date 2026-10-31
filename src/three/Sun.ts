import { Debug, Experience, StaticObject, type LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import { smoothstep } from "three/src/nodes/TSL.js";
import { atan, color, cos, deltaTime, float, mix, mrt, mx_fractal_noise_float, mx_noise_float, output, positionLocal, remap, sin, time, uniform, uv, vec3 } from "three/tsl";
import * as THREE from "three/webgpu"
import gsap from "gsap";


export default class Sun extends StaticObject {
  declare private debug: Debug
  declare private debugFolder: ParametersGroup
  declare material: THREE.MeshStandardNodeMaterial;

  /**
   * variables
   */
  public sunScale: number = 1.;

  /**
   * Palette
   */
  public endSunLowRed = new THREE.Color("rgb(102,27,0)")
  public endSunHighRed = new THREE.Color("rgb(217,13,13)")
  public endSunlightBlue = new THREE.Color("#8DFEFF")


  public red = new THREE.Color("#FF4200")
  public orange = new THREE.Color("#FF9300")
  public yellow = new THREE.Color("#FFAE00")

  /**
   * Uniforms
   */
  public offset = uniform(4.4)
  public spread = uniform(.35)
  public maskScale = uniform(.15)
  public speed = uniform(.1)
  public smoothBlend = uniform(.5)
  public emissiveIntensity = uniform(1.)

  public lowColor = uniform(this.red)
  public highColor = uniform(this.yellow)

  /**
   * EXPLOSION
   */
  declare private explosionMesh: THREE.Mesh

  /**
   * Explosion uniforms
   */
  public ondulationSpeed = uniform(1.);
  public ondulationScale = uniform(2.);
  public ondulationNoiseScale = uniform(.1);

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
    this.material.emissiveNode = mix(this.lowColor, this.highColor, maskMap).mul(this.emissiveIntensity)
    // this.material.emissiveNode = mix(this.lightBlue,color("white"), maskMap).mul(this.emissiveIntensity)
  }
  setTextures(): void {

  }
  setMesh(): void {
    super.setMesh()
  }

  createExplosionMesh() {
    const geometry = new THREE.SphereGeometry(65, 200, 200)
    const material = new THREE.MeshStandardNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide
    });
    material.mrtNode = mrt({
      bloomIntensity: float(1.)
    })
    material.needsUpdate = true;
    material.opacity = .1;

    const dirNode = positionLocal.normalize();
    const scaledPos = positionLocal.mul(float(this.ondulationNoiseScale))
    const noise = mx_noise_float(scaledPos.add(time.mul(this.ondulationSpeed)))
    const displacement = positionLocal.add(dirNode.mul(sin(noise)).mul(this.ondulationScale))

    material.positionNode = displacement;
    // const remappedFactor = remap(0., 1., .5, 1., noise.r)
    material.emissiveNode = this.highColor.mul(this.emissiveIntensity)
    material.colorNode = mix(this.lowColor, this.highColor, noise.r);

    this.explosionMesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.explosionMesh)
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

    this.debugFolder.addColor(this.lowColor, "value").name("low sun color")
    this.debugFolder.addColor(this.highColor, "value").name("high sun color")

    const explosionFolder = this.debugFolder.addFolder("💥 Explosion");
    explosionFolder.add(this.ondulationSpeed, "value", 0., 10., .01).name("Ondulation Speed");
    explosionFolder.add(this.ondulationScale, "value", 0., 20., .01).name("Ondulation Scale");
    explosionFolder.add(this.ondulationNoiseScale, "value", 0., 10., .001).name("Ondulation Noise Scale");
    explosionFolder.add(this, "sunScale", 0., 5., .001).name("Scale").onChange(this.updateSunScale);
    explosionFolder.add(this, "triggerSunExplosion");
    //colors
    // this.debugFolder.addColor(this.red, "").name("color 1")

  }

  updateSunScale = () => {
    this.mesh.scale.setScalar(this.sunScale);
    if (this.explosionMesh) {
      this.explosionMesh.scale.setScalar(this.sunScale);
    }
  }

  triggerSunExplosion = () => {
    let durations = {
      sunScaling: 15
    }

    let sunScalingTl = gsap.timeline({ onUpdate: this.updateSunScale })
    sunScalingTl.to(this, {
      "sunScale": 2.,
      duration: durations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.lowColor.value, {
      "r": this.endSunLowRed.r,
      "g": this.endSunLowRed.g,
      "b": this.endSunLowRed.b,
      duration: durations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.highColor.value, {
      "r": this.endSunHighRed.r,
      "g": this.endSunHighRed.g,
      "b": this.endSunHighRed.b,
      duration: durations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.emissiveIntensity, {
      "value": 2.,
      duration: durations.sunScaling,
      ease: "sine.inOut"
    }, 0)

    //1. sunScale
    // let scaleTl = gsap.timeline({
    //   onUpdate: this.updateSunScale
    // });
    // scaleTl
    //   .to(this, {
    //     "sunScale": 2.,
    //     duration: 10,
    //     ease: "sine.inOut"
    //   })
    //   .to(this, {
    //     "sunScale": 0.1,
    //     ease: "power2.inOut",
    //     duration: 3
    //   })
    //   .to(this, {
    //     "sunScale": 9.,
    //     duration: 5
    //   })

    //2. sun color
    // let colorTl = gsap.timeline();
    // colorTl.to(this.lowColor.value, {
    //   "r": this.endSunLowRed.r,
    //   "g": this.endSunLowRed.g,
    //   "b": this.endSunLowRed.b,
    //   duration: 10
    // }, 0)
    // colorTl.to(this.highColor.value, {
    //   "r": this.endSunHighRed.r,
    //   "g": this.endSunHighRed.g,
    //   "b": this.endSunHighRed.b,
    //    duration: 10
    // }, 0)
  }

  update = () => {};
  destroy = () => {};
}
