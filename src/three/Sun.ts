import { Experience, OrbitCamera, type LifeTimeObject } from "@plugins/three-base-experience";
import * as THREE from "three/webgpu"


export default class Sun implements LifeTimeObject{
  declare public mesh: THREE.Mesh
  declare material: THREE.MeshBasicNodeMaterial
  declare private experience: Experience
  constructor() {
    if (!Experience.instance) throw new Error("can't create sun, no experience")
    this.experience = Experience.instance

    this.mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    this.mesh.position.set(-346.86, -26.50, -234.20)
    this.mesh.receiveShadow = true;
  }
  createGeometry = () => {
    return new THREE.SphereGeometry(50, 200, 200)
  }
  createMaterial = () => {
    this.material = new THREE.MeshBasicNodeMaterial({
      color: "#FEC903"
    })
    return this.material;
  }

  init = () => {};
  update = () => {};
  destroy = () => {};
}
