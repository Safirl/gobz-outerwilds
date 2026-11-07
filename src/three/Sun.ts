import { Debug, StaticObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import { smoothstep } from "three/src/nodes/TSL.js";
import { float, Fn, mix, mrt, mx_fractal_noise_float, mx_noise_float, positionLocal, remap, sin, time, uniform } from "three/tsl";
import * as THREE from "three/webgpu"
import gsap from "gsap";
import type ExpWorld from "./World";


export default class Sun extends StaticObject {
  declare debug: Debug
  declare debugFolder: ParametersGroup
  declare material: THREE.MeshStandardNodeMaterial;
  declare private world: ExpWorld;

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
  public endSunLowBlue = new THREE.Color("rgba(123, 151, 248, 1)")

  public explosionSunColor = new THREE.Color("rgba(255, 198, 173, 1)")

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

  private sunScalingDownValues = {
    ondulationScale: 19.,
  }

  private sunScalingUpValues = {
    ondulationScale: 5.,
  }

  public sunOndulationSpeed = uniform(.34);
  public sunOndulationScale = uniform(0.);
  public sunOndulationNoiseScale = uniform(.053);

  public lowColor = uniform(this.red)
  public highColor = uniform(this.yellow)

  /**
   * EXPLOSION
   */
  declare private explosionMesh: THREE.Mesh

  /**
   * Explosion uniforms
   */
  public exploOndulationSpeed = uniform(1.);
  public exploOndulationScale = uniform(2.);
  public exploOndulationNoiseScale = uniform(.345);

  constructor() {
    super()
    this.init()
    this.world = this.experience.world as ExpWorld;
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

    // this.material.emissiveNode = mix(color(this.endSunLowRed), color(this.endSunHighRed), maskMap).mul(this.emissiveIntensity)
    // this.material.emissiveNode = mix(this.lightBlue,color("white"), maskMap).mul(this.emissiveIntensity)

    //ondulation
    const dirNode = positionLocal.normalize();
    const scaledPos = positionLocal.mul(float(this.sunOndulationNoiseScale))
    const noise = mx_noise_float(scaledPos.add(time.mul(this.sunOndulationSpeed)))
    const displacement = positionLocal.add(dirNode.mul(sin(noise)).mul(this.sunOndulationScale))

    this.material.positionNode = displacement;
  }
  setTextures(): void {

  }
  setMesh(): void {
    super.setMesh()
  }

  createExplosionMesh() {
    const geometry = new THREE.SphereGeometry(55, 200, 200)
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
    const scaledPos = positionLocal.mul(float(this.exploOndulationNoiseScale));
    const noise = mx_noise_float(scaledPos.add(time.mul(this.exploOndulationSpeed)));
    const displacement = positionLocal.add(dirNode.mul(sin(noise)).mul(this.exploOndulationScale))
    // const displacement = this.ondulationDisplacement();

    material.positionNode = displacement;
    // const remappedFactor = remap(0., 1., .5, 1., noise.r)
    material.emissiveNode = this.highColor.mul(this.emissiveIntensity)
    material.colorNode = mix(this.lowColor, this.highColor, noise.r);

    this.explosionMesh = new THREE.Mesh(geometry, material);
    // this.explosionMesh.position.copy(this.mesh.position);
    // this.scene.add(this.explosionMesh)
    this.mesh.add(this.explosionMesh)
    this.explosionMesh.visible = false;
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

    this.debugFolder.add(this.sunOndulationSpeed, "value", 0., 10., .01).name("Ondulation Speed");
    this.debugFolder.add(this.sunOndulationScale, "value", 0., 20., .01).name("Ondulation Scale");
    this.debugFolder.add(this.sunOndulationNoiseScale, "value", 0., 10., .001).name("Ondulation Noise Scale");

    const explosionFolder = this.debugFolder.addFolder("💥 Explosion");
    explosionFolder.add(this.exploOndulationSpeed, "value", 0., 10., .01).name("Ondulation Speed");
    explosionFolder.add(this.exploOndulationScale, "value", 0., 20., .01).name("Ondulation Scale");
    explosionFolder.add(this.exploOndulationNoiseScale, "value", 0., 10., .001).name("Ondulation Noise Scale");
    explosionFolder.add(this, "sunScale", 0., 5., .001).name("Scale").onChange(this.updateSunScale);

  }

  updateSunScale = () => {
    this.mesh.scale.setScalar(this.sunScale);
  }

  triggerSunExplosion = () => {
    let sunScalingTl = gsap.timeline({ onUpdate: this.updateSunScale, onComplete: () => this.scaleDownSun() })
    sunScalingTl.to(this, {
      "sunScale": 2.5,
      duration: this.world.transitionDurations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.lowColor.value, {
      "r": this.endSunLowRed.r,
      "g": this.endSunLowRed.g,
      "b": this.endSunLowRed.b,
      duration: this.world.transitionDurations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.highColor.value, {
      "r": this.endSunHighRed.r,
      "g": this.endSunHighRed.g,
      "b": this.endSunHighRed.b,
      duration: this.world.transitionDurations.sunScaling,
      ease: "sine.inOut"
    }, 0)
    .to(this.emissiveIntensity, {
      "value": 3.3,
      duration: this.world.transitionDurations.sunScaling,
      ease: "sine.inOut"
    }, 0)
  }

  private scaleDownSun = () => {
    let tl = gsap.timeline({ onUpdate: this.updateSunScale, onComplete: this.scaleUpSun })
    tl.to(this, {
      "sunScale": .01,
      duration: this.world.transitionDurations.sunScalingDown,
      ease: "sine.inOut"
    })
    .to(this.sunOndulationScale, {
      "value": this.sunScalingDownValues.ondulationScale,
      duration: this.world.transitionDurations.sunScalingDown * .75,
      ease: "power2.inOut"
    }, "<")
    .to(this.highColor.value, {
      "r": this.orange.r,
      "g": this.orange.g,
      "b": this.orange.b,
      duration: this.world.transitionDurations.sunScalingDown,
      ease: "power3.in"
    }, "<")
    .to(this.lowColor.value, {
      "r": this.explosionSunColor.r,
      "g": this.explosionSunColor.g,
      "b": this.explosionSunColor.b,
      duration: this.world.transitionDurations.sunScalingDown * .7,
      ease: "power3.in",
    }, "<" + this.world.transitionDurations.sunScalingDown * .3)
  }

  private scaleUpSun = () => {
    let tl = gsap.timeline({ onUpdate: this.updateSunScale })
    tl.to(this, {
      "sunScale": 9.,
      duration: this.world.transitionDurations.sunExplosion,
      ease: "sine.inOut"
    }, 0)
    .to(this.sunOndulationScale, {
      "value": this.sunScalingUpValues.ondulationScale,
      duration: this.world.transitionDurations.sunExplosion * .5,
      ease: "power2.inOut"
    }, "<")
    .to(this.highColor.value, {
      "r": this.endSunlightBlue.r,
      "g": this.endSunlightBlue.g,
      "b": this.endSunlightBlue.b,
      // duration: this.world.transitionDurations.sunExplosion,
      ease: "power3.in"
    }, "<")
    .to(this.lowColor.value, {
      "r": this.endSunLowBlue.r,
      "g": this.endSunLowBlue.g,
      "b": this.endSunLowBlue.b,
      // duration: this.world.transitionDurations.sunExplosion,
      ease: "power3.in",
    }, "<")
    // .to(this.emissiveIntensity, {
    //   "value": 1.,
    //   ease: "sine.inOut"
    // }, "<")
    this.explosionMesh.visible = true;
  }

  update = () => {};
  destroy = () => {};
}
