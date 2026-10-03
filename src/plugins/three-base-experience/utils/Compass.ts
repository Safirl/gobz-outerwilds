import type Experience from "../experience/Experience";
import OrbitCamera from "../template/OrbitCamera";
import type { LifeTimeObject } from "../types/types";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import * as THREE from "three/webgpu"
import type Debug from "./Debug";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";

/**
 * Creates a compass that can be attached on any raycastable object, or manually.
 */
export default class Compass implements LifeTimeObject {
  declare private experience: Experience
  declare private scene: THREE.Scene
  public object: THREE.Object3D | null = null
  declare public controls: TransformControls
  declare private raycaster: THREE.Raycaster
  declare private debug: Debug
  declare private debugFolder: ParametersGroup
  declare private transformDebugFolder: ParametersGroup
  public compassEnabled = false

  constructor(experience: Experience, scene: THREE.Scene, attachedObject?: THREE.Object3D) {
    this.experience = experience
    this.scene = scene
    this.raycaster = new THREE.Raycaster();
    this.debug = this.experience.debug;

    if (attachedObject) {
      this.object = attachedObject
    }
  }

  init = () => {
    if (this.compassEnabled) this.createCompass();

    if (this.experience.debug.active) {
      this.setDebugObject()
    }
  };

  update = () => {};
  destroy = () => {
    this.controls.removeEventListener("dragging-changed", this.onDraggingChanged)
    this.experience.canvas.removeEventListener("click", this.onClick)
    this.setObject(null)
    this.experience.scene.remove(this.controls.getHelper())
    this.controls.detach();
  };

  createCompass = () => {
    const renderer = this.experience.renderer.instance as THREE.WebGPURenderer
    this.controls = new TransformControls(this.experience.camera.instance, renderer.domElement)
    // this.controls.setMode("rotate")
    const gizmo = this.controls.getHelper();
    this.setObject(this.object)
    this.experience.scene.add(gizmo);
    this.controls.addEventListener('dragging-changed', this.onDraggingChanged);
    this.experience.canvas.addEventListener("click", this.onClick)
  }

  setDebugObject = () => {
    if (!this.debugFolder) {
      this.debugFolder = this.debug.inspector.createParameters("📐 Compass");
      this.debugFolder
        //@ts-ignore
        .add(this, "compassEnabled")
        .name("enabled")
        .onChange(() => {
          this.compassEnabled ? this.createCompass() : this.destroy()
        })
    }
  }

  onDraggingChanged = (e: {
      value: unknown;
  } & THREE.Event<"dragging-changed", TransformControls>) => {
    if (!this.object) return;
    console.log(this.controls.object.position)
    const cam = this.experience.camera
    if (cam instanceof OrbitCamera) {
      cam.controls.enabled = !e.value;
    }
  }

  onClick = (e: PointerEvent) => {
    let pointer = new THREE.Vector2();
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera(pointer, this.experience.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);
    console.log(intersects)

    if (intersects.length > 0) {
      if (intersects[0].object == this.controls.getHelper()) {
        return;
      }
      this.setObject((intersects[0].object))
    }
    else {
      this.setObject(null)
   	}
  }

  setObject = (newObject: THREE.Object3D | null) => {
    if (this.object) {
      this.controls.detach();
    }
    this.object = newObject
    if (this.object) {
      this.controls.attach(this.object)
    }
    if (this.experience.debug.active) {
      this.setDebugObject()
    }
  }

}
