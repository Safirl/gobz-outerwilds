import {Experience, World, Environment, OrbitCamera} from "@plugins/three-base-experience";
import * as THREE from "three/webgpu";
import Campfire from "./Campfire";
import Moon from "./Moon";
import Sun from "./Sun";
import Compass from "@plugins/three-base-experience/utils/Compass";
import Earth from "./Earth";
import Stick from "./Stick";

export default class ExpWorld extends World {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare firecamp: Campfire
  declare moon: Moon
  declare sun: Sun
  declare earth: Earth
  declare compass: Compass
  declare stick: Stick

  init() {
    super.init();
    this.environment = new Environment(
      this.resources.items.spaceEnvTexture as THREE.CubeTexture,
      false,
    );
    if (this.experience.debug.active) {
      this.compass = new Compass(this.experience, this.scene)
      this.compass.init()
    }
    // const ambientLight = new THREE.AmbientLight()
    // this.scene.add(ambientLight)
    this.firecamp = new Campfire();
    this.firecamp.init()
    this.moon = new Moon();
    // this.moon.init()
    this.earth = new Earth();
    this.sun = new Sun();
    this.createStick()

    this.scene.add(this.sun.mesh)
  }

  createStick = () => {
    this.stick = new Stick()
  }

  update() {
    this.stick.update();
  }

  destroy(): void {
    this.compass.destroy()
    this.sun.destroy()
    this.moon.destroy()
    this.firecamp.destroy()

    super.destroy();
  }
}
