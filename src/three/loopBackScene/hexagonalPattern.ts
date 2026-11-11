import { Experience, type Debug, type LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import * as THREE from "three/webgpu"

export default class HexagonalPattern implements LifeTimeObject {
  declare debug: Debug;
  declare debugFolder: ParametersGroup
  declare experience: Experience
  declare scene: THREE.Scene
  declare mesh: THREE.Mesh

  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.scene = this.experience.scene
  }
  init(): void {

  }
  createMesh() {
    this.mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    this.scene.add(this.mesh)
  }
  createMaterial(): THREE.MeshBasicMaterial {
    const material = new THREE.MeshStandardNodeMaterial();
  }
  createGeometry(): THREE.BufferGeometry {

  }
  destroy(): void {

  }
  update(): void {

  }
}
