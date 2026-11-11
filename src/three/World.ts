import {Experience, World, Environment, OrbitCamera, GPURenderer, Debug} from "@plugins/three-base-experience";
import * as THREE from "three/webgpu";
import Campfire from "./galaxyScene/Campfire";
import Moon from "./galaxyScene/Moon";
import Sun from "./galaxyScene/Sun";
import Compass from "@plugins/three-base-experience/utils/Compass";
import Earth from "./galaxyScene/Earth";
import Stick from "./galaxyScene/Stick";
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
  declare private galaxyScene: THREE.Group
  declare private loopBackScene: THREE.Group

  declare debug: Debug
  declare debugFolder: ParametersGroup

  declare private transition: WakeUpTransition

  public transitionDurations = {
    sunScaling: 15,//15,
    sunScalingDown: 7.,//7.
    sunExplosion: 15.//7.
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
    this.galaxyScene = new THREE.Group()
    this.firecamp = new Campfire();
    this.firecamp.init()
    this.firecamp.addToGroup(this.galaxyScene)

    this.moon = new Moon();
    // this.moon.init()
    this.moon.addToGroup(this.galaxyScene)
    this.earth = new Earth();
    this.earth.addToGroup(this.galaxyScene)
    this.sun = new Sun();
    this.sun.addToGroup(this.galaxyScene)

    this.stick = new Stick()
    this.stick.addToGroup(this.galaxyScene)

    // this.scene.add(this.galaxyScene)

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
    setTimeout(() => {
      this.galaxyScene.visible = false;
    }, 1000*(this.transitionDurations.sunExplosion + this.transitionDurations.sunScaling + this.transitionDurations.sunScalingDown))
  }

  switchIsAwake = () => {
    this.isAwake = !this.isAwake
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
