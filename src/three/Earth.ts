import { Actor, Experience, type LifeTimeObject } from "@plugins/three-base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu"

export default class Earth extends Actor{
  declare public mesh: THREE.Mesh
  declare material: THREE.MeshStandardNodeMaterial
  constructor() {
    if (!Experience.instance) return;
    super("earth", Experience.instance?.resources.items.earthModel as GLTF, true, false)
    this.init()
  }
  init = () => {
    this.model.position.set(-258.56, 36.51, -307)
    this.model.position.y += Math.PI/4
    this.model.scale.set(35., 35., 35.)
  };
  update = () => {};
  destroy = () => {};
}
