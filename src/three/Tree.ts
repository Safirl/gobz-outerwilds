import { Actor, Debug, Experience } from "@plugins/three-base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu"

export default class Tree extends Actor {
  declare experience: Experience
  public phi = { value: -3.14159265358979 }
  public theta = { value: -3.14159265358979 }
  declare radius: number
  declare planetCenter: THREE.Vector3
  declare name: string

  constructor(
    phi: number,
    theta: number,
    planetRadius: number,
    planetCenter: THREE.Vector3,
    name: string,
    resource: GLTF,
    autoAddToScene: boolean = true,
    makeUnique: boolean = false,
    collisionResource?: GLTF
  ) {
    super(name, resource, autoAddToScene, makeUnique, collisionResource)

    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.phi.value = phi
    this.theta.value = theta
    this.radius = planetRadius
    this.planetCenter = planetCenter
    this.name = name
    this.calculateTreePositionAndRotation()

    this.setDebugObject()
  }

  calculateTreePositionAndRotation = () => {
    const theta = this.theta.value
    const phi = this.phi.value

    const x = this.radius * Math.cos(phi) * Math.cos(theta);
    const y = this.radius * Math.sin(phi);
    const z = this.radius * Math.cos(phi) * Math.sin(theta);

    this.model.position.x = this.planetCenter.x + x
    this.model.position.y = this.planetCenter.y + y
    this.model.position.z = this.planetCenter.z + z

    const direction = new THREE.Vector3().subVectors(this.planetCenter, this.model.position).normalize();

    // Orienter le chat pour que ses pieds touchent la planète
    const upVector = new THREE.Vector3(0, -1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, direction);
    this.model.quaternion.copy(quaternion);
  }

  setDebugObject = () => {
    super.setDebugObject()
    if (!this.debug.active) return;
    this.debugFolder.close()
    this.debugFolder.add(this.theta, "value", -Math.PI, Math.PI, Math.PI/64).onChange(this.calculateTreePositionAndRotation).name("tree theta")
    this.debugFolder.add(this.phi, "value", -Math.PI, Math.PI, Math.PI/64).onChange(this.calculateTreePositionAndRotation).name("tree phi")
  }
}
