import { Actor, Camera, convertStandardMaterial, Experience } from "@plugins/three-base-experience"
import type { GLTF } from "three/examples/jsm/Addons.js";
import type ExperienceCamera from "./Camera";
import * as THREE from "three/webgpu"
import gsap from "gsap";
import { color, float, mix, smoothstep, uniform } from "three/tsl";

export default class Stick extends Actor {
  declare camera: ExperienceCamera
  private endPosition = new THREE.Vector3(.75, .75, .31)
  private initialPosition = new THREE.Vector3(1.31, .75, .47)
  private marshmallowName = "Marshmellow_Marshmellow_0"
  private marshmallowMaterial = "Marshmellow_Marshmellow_0"

  private burnPercentage = 1.0
  private cookPercentage = .9;
  private currentCookPercentage = uniform(0.)

  private burnedColor = color("#572102")
  private whiteColor = color()

  private isCooking = false;

  constructor() {
    if (!Experience.instance) return;
    super("🥢 stick", Experience.instance.resources.items.marshmallowModel as GLTF, true, false)
    this.init()
  }

  init = () => {
    this.camera = this.experience.camera as ExperienceCamera
    if (!this.camera) return;

    this.model.position.copy(this.initialPosition)
    this.model.rotation.y = -0.34
    this.model.scale.set(1.8, 1.8, 1.8)
    // this.model.lookAt(new THREE.Vector3(0, 0, 0))
    this.overridedSetDebugObject()
    this.initEvents();
    this.initMarshmallowMaterial()
  }

  initMarshmallowMaterial() {
    this.model.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        if (c.name !== this.marshmallowName) return;
        c.castShadow = false;
        const currentMaterial = c.material as THREE.MeshStandardMaterial
        if (!currentMaterial) return;

        const material = convertStandardMaterial(currentMaterial)
        this.whiteColor = color(material.color)
        material.colorNode = mix(this.whiteColor, this.burnedColor, float(this.currentCookPercentage))

        c.material = material;
      }
    })
  }

  initEvents = () => {
    this.experience.canvas.addEventListener("mousedown", this.triggerAnimation)
    this.experience.canvas.addEventListener("mouseup", this.releaseAnimation)
  }

  triggerAnimation = () => {
    gsap.to(this.model.position, {
      x: this.endPosition.x,
      y: this.endPosition.y,
      z: this.endPosition.z,
      ease: "power1.inOut",
      onComplete: () => this.isCooking = true
    })
  }

  releaseAnimation = () => {
    gsap.to(this.model.position, {
      x: this.initialPosition.x,
      y: this.initialPosition.y,
      z: this.initialPosition.z,
      ease: "power1.inOut",
      onComplete: () => this.isCooking = false
    })
  }

  update(): void {
    super.update()
    if (this.isCooking) {
      this.currentCookPercentage.value += 0.0001 * this.experience.time.delta
    }
  }

  overridedSetDebugObject(): void {
    if (!this.debug.active) return;
    this.debugFolder.add(this.model.position, "x", -5., 5., .01).name("pos x")
    this.debugFolder.add(this.model.position, "y", -5., 5., .01).name("pos y")
    this.debugFolder.add(this.model.position, "z", -5., 5., .01).name("pos z")
    this.debugFolder.add(this.model.rotation, "y", -Math.PI, Math.PI, .01).name("rot y")
  }
}
