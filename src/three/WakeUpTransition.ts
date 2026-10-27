import { Debug, EventEmitter, Experience, GPURenderer, World, type LifeTimeObject } from "@plugins/three-base-experience";
import { uv, color, mix, length, vec4, smoothstep } from "three/tsl";
import { hashBlur } from "three/examples/jsm/tsl/display/hashBlur.js";
import type { WebGPURenderer } from "three/webgpu";
import * as THREE from "three/webgpu"
import { uniform } from "three/src/nodes/TSL.js";
import gsap from "gsap";
import type ExpWorld from "./World";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";

export default class WakeUpTransition extends EventEmitter implements LifeTimeObject {
  declare experience: Experience
  declare renderer: WebGPURenderer
  declare baseNode: THREE.Node
  declare private world: ExpWorld

  declare private awakeElement: HTMLDivElement
  declare private lookAroudElement: HTMLDivElement

  declare debug: Debug;
  declare debugFolder: ParametersGroup;

  //uniforms
  private radius = uniform(.7);
  private blurStregth = uniform(0.01);

  constructor() {
    super()
    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.renderer = this.experience.renderer.instance as WebGPURenderer
    this.awakeElement = document.querySelector("#wakeUp") as HTMLDivElement
    this.lookAroudElement = document.querySelector("#lookAround") as HTMLDivElement
    this.world = this.experience.world as ExpWorld;
    this.setDebugObject();
  }
  init() {
    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();
    const outputNode = renderPipeline.outputNode as THREE.RenderOutputNode;

    const coords = uv().sub(.5).mul(2.);
    const mask = smoothstep(0.6, 1.0, length(coords).add(this.radius));
    const transColor = color("#0D0E18");
    const blur = hashBlur(vec4(outputNode.rgb, 1.), this.blurStregth, { repeats: 10 })
    this.baseNode = outputNode
    renderPipeline.outputNode = mix(blur, transColor, mask)
    renderPipeline.needsUpdate = true;
    this.bindEvents();
  };
  bindEvents() {
    this.experience.canvas.addEventListener("click", this.openEyes)
  }
  openEyes = () => {
    if (this.world.isAwake) return;

    gsap.to(this.radius, {
      value: -1,
      duration: 1.
    })
    gsap.to(this.awakeElement, {
      opacity: "0",
    })
    gsap.to(this.lookAroudElement, {
      opacity: "1",
    })
    gsap.to(this.blurStregth, {
      value: 0.,
      duration: 1.5,
      onComplete: () => {
        const renderer = this.experience.renderer as GPURenderer;
        const renderPipeline = renderer.getRenderPipeline();

        renderPipeline.outputNode = this.baseNode; //remove blur to improve performances.
        renderPipeline.needsUpdate = true;
        this.trigger("onAwake");
      }
    })
    setTimeout(() => {
      document.addEventListener("mousemove", this.removeMoveMouseHelper)
    }, 1500)
  }

  removeMoveMouseHelper = () => {
    document.removeEventListener("mousemove", this.removeMoveMouseHelper)
    gsap.to(this.lookAroudElement, {
      opacity: "0",
    })
  }

  setDebugObject(): void {
    if (!this.experience.debug.active) return;
    this.debug = this.experience.debug
    this.debugFolder = this.debug.inspector.createParameters("Introduction");
    //@ts-ignore
    this.debugFolder.add(this, "openEyes");

  }

  destroy() {
    this.experience.canvas.removeEventListener("click", this.openEyes)
    gsap.killTweensOf(this.radius)
    gsap.killTweensOf(this.blurStregth)
    gsap.killTweensOf(this.awakeElement.style)
    gsap.killTweensOf(this.lookAroudElement.style)
    document.removeEventListener("mousemove", this.removeMoveMouseHelper)
  };
  update() {};
}
