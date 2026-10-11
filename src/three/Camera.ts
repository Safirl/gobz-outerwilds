import { Actor, Camera, easeOutSine, lerp } from "@plugins/three-base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from 'three/webgpu'

export default class ExperienceCamera extends Camera {
  private currentRotation: THREE.Vector3 = new THREE.Vector3()
  private targetRotation: THREE.Vector3 = new THREE.Vector3()

  public sensitivity = .002
  public maxPitch = Math.PI / 4;
  public maxYaw = Math.PI / 4;

  init(): void {
    super.init()
  }

  setInstance(): void {
    this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			1000
    );
  }

  setControls(): void {
    this.instance.position.set(1.87, 1.83, 1.59);
    this.instance.rotation.order = "YXZ";
    this.instance.rotation.set(.011, .7784, 0.)

    const { x, y } = this.instance.rotation;
    this.currentRotation = new THREE.Vector3(x, y, 0);
    this.targetRotation = new THREE.Vector3(x, y, 0);

    document.addEventListener("click", () => {
      this.experience.canvas.requestPointerLock()
    })
    this.experience.canvas.addEventListener("mousemove", this.onMouseMove)
  }

  onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== this.experience.canvas) return;

    this.targetRotation.y -= e.movementX * this.sensitivity
    this.targetRotation.x -= e.movementY * this.sensitivity

    this.targetRotation.x = THREE.MathUtils.clamp(
      this.targetRotation.x,
      -this.maxPitch,
      this.maxPitch
    );
    this.targetRotation.y = THREE.MathUtils.clamp(
      this.targetRotation.y,
      -this.maxYaw,
      3*this.maxYaw
    );
  }

  updateTargetRotation() {
    this.targetRotation
  }

  update(): void {
    //smooth rotation
    this.currentRotation.x = lerp(this.currentRotation.x, this.targetRotation.x, .1)
    this.currentRotation.y = lerp(this.currentRotation.y, this.targetRotation.y, .1)
    this.currentRotation.z = lerp(this.currentRotation.z, this.targetRotation.z, .1)

    this.instance.rotation.set(this.currentRotation.x, this.currentRotation.y, this.currentRotation.z)
  }

  setDebugObject(): void {
    super.setDebugObject()
    if (this.debug.active) {
      this.debugFolder.add(this.instance.position, "x", -5., 5., .01).name("pos x")
      this.debugFolder.add(this.instance.position, "y", -5., 5., .01).name("pos y")
      this.debugFolder.add(this.instance.position, "z", -5., 5., .01).name("pos z")

      this.debugFolder.add(this.instance.rotation, "x", -Math.PI, Math.PI, .01).name("rot x")
      this.debugFolder.add(this.instance.rotation, "y", -Math.PI, Math.PI, .01).name("rot y")
      this.debugFolder.add(this.instance.rotation, "z", -Math.PI, Math.PI, .01).name("rot z")
    }
  }

  destroy(): void {
    this.experience.canvas.removeEventListener("mousemove", this.onMouseMove)
  }
}
