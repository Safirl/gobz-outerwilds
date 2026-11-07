import {Experience, World, Environment, OrbitCamera, GPURenderer, Debug} from "@plugins/three-base-experience";
import * as THREE from "three/webgpu";
import Campfire from "./Campfire";
import Moon from "./Moon";
import Sun from "./Sun";
import Compass from "@plugins/three-base-experience/utils/Compass";
import Earth from "./Earth";
import Stick from "./Stick";
import WakeUpTransition from "./WakeUpTransition";
import BloomPostProcess from "./BloomPostProcess";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import BurnPostProcess from "./BurnPostProcess";

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
  public isAwake = false;
  declare private bloomPostProcess: BloomPostProcess
  declare private burnPostProcess: BurnPostProcess

  declare debug: Debug
  declare debugFolder: ParametersGroup

  declare private transition: WakeUpTransition

  public transitionDurations = {
    sunScaling: 3,//15,
    sunScalingDown: 3.,//7.
    sunExplosion: 10.//7.
  }

  init() {
    super.init();

    this.debug = this.experience.debug
    if (this.debug.active) {
      this.setDebugObject();
    }

    this.environment = new Environment(
      this.resources.items.spaceEnvTexture as THREE.CubeTexture,
      false,
    );
    if (this.experience.debug.active) {
      this.compass = new Compass(this.experience, this.scene)
      this.compass.init()
    }
    this.bloomPostProcess = new BloomPostProcess(this.experience);
    this.burnPostProcess = new BurnPostProcess(this.experience);
    this.bloomPostProcess.init();
    this.burnPostProcess.init();
    // const ambientLight = new THREE.AmbientLight()
    // this.scene.add(ambientLight)
    this.firecamp = new Campfire();
    this.firecamp.init()
    this.moon = new Moon();
    // this.moon.init()
    this.earth = new Earth();
    this.sun = new Sun();
    // this.createStick()

    this.scene.add(this.sun.mesh)

    this.transition = new WakeUpTransition()
    this.transition.on("onAwake", () => this.switchIsAwake)
    this.transition.init();
  }

  setDebugObject = () => {
    this.debugFolder = this.debug.inspector.createParameters("GENERAL")
    this.debugFolder.add(this, "triggerSunExplosion")
  }

  triggerSunExplosion = () => {
    this.sun.triggerSunExplosion();
    this.environment.triggerSunExplosion();
    this.burnPostProcess.triggerSunExplosion()
  }

  switchIsAwake = () => {
    this.isAwake = !this.isAwake
  }

  createStick = () => {
    this.stick = new Stick()
  }

  update() {
    if (this.stick) {
      this.stick.update();
    }
  }

  destroy(): void {
    this.compass.destroy()
    this.sun.destroy()
    this.moon.destroy()
    this.firecamp.destroy()

    super.destroy();
  }
}
