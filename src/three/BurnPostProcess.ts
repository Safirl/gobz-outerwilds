import type { Debug, Experience, GPURenderer, LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import { emissive, float, vec3, vec4, max, uniform, smoothstep, mix, luminance } from "three/tsl";
import * as THREE from "three/webgpu";
import type ExpWorld from "./World";
import gsap from "gsap"

export default class BurnPostProcess implements LifeTimeObject{
  declare private experience: Experience
  declare public burnOutput: THREE.TextureNode
  public burnProgress = uniform(.5)
  declare debug?: Debug | undefined;
  declare debugFolder?: ParametersGroup | undefined;
  declare world: ExpWorld
  declare whiteScreen: HTMLDivElement

  /**
   * Variables
   */
  public burnIntensity = uniform(.1);
  public effectIntensity = uniform(.1);

  constructor(experience: Experience) {
    this.experience = experience;
    this.debug = this.experience.debug
    this.world = this.experience.world as ExpWorld
    this.whiteScreen = document.querySelector("#whiteScreen") as HTMLDivElement;
  }

  init(): void {
    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();

    const outputNode = renderPipeline.outputNode as THREE.RenderOutputNode;

    const color = outputNode.rgb

    const lum = luminance(color.rgb);

    const whiteness = smoothstep(0, this.burnIntensity, this.burnProgress.mul(float(1.).add(this.burnIntensity)).sub(float(1).sub(lum)));

    const burnFade = vec4(mix(outputNode.rgb, vec3(1), whiteness), 1);
    //@ts-ignore
    this.burnOutput = outputNode.add(burnFade.mul(this.effectIntensity));
    this.burnOutput.toInspector();
    renderPipeline.outputNode = this.burnOutput
    renderPipeline.needsUpdate = true;

    if (this.debug?.active) {
      this.setDebugObject();
    }
  }

  triggerSunExplosion(debug: boolean = false) {
    const delay = debug ? 0 : this.world.transitionDurations.sunScaling + this.world.transitionDurations.sunScalingDown + this.world.transitionDurations.sunExplosion * .6
    const tl = gsap.timeline({delay: delay});
    tl.to(this.burnProgress, {
      "value": 1.,
      duration: this.world.transitionDurations.sunExplosion * .2,
      ease: "power2.out"
    }, 0)
    .to(this.effectIntensity, {
      "value": 1.,
      duration: this.world.transitionDurations.sunExplosion * .2,
      ease: "power2.out"
    }, 0)
    .to(this.whiteScreen, {
      opacity: "1"
    }, ">")
    .to(this.whiteScreen, {
      backgroundColor: "#0D0E18",
      duration: 3.
    }, ">" + 1.5)
  }

  update(): void {

  }
  destroy(): void {

  }

  debugTriggerSunExplosion = () => {
    this.triggerSunExplosion(true);
  }

  setDebugObject(): void {
    this.debugFolder = this.experience.debug.inspector.createParameters("⚪️ Burn PostProcess");
    this.debugFolder?.add(this.burnIntensity, "value", 0., 1., .01).name("burn intensity");
    this.debugFolder?.add(this.burnProgress, "value", 0., 1., .01).name("burn progress");
    this.debugFolder?.add(this.effectIntensity, "value", 0., 1., .01).name("effect intensity");
    this.debugFolder?.add(this, "debugTriggerSunExplosion").name("trigger effect anim");
  }
}
