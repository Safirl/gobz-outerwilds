import { Experience, GPURenderer, type LifeTimeObject } from "@plugins/three-base-experience";
import { float, uv, color, mix, mrt, output, pass, texture, vec2, length } from "three/tsl";
import { hashBlur } from "three/examples/jsm/tsl/display/hashBlur.js";
import type { WebGPURenderer } from "three/webgpu";
import * as THREE from "three/webgpu"
import { uniform } from "three/src/nodes/TSL.js";
import gsap from "gsap";

export default class WakeUpTransition implements LifeTimeObject {
  declare experience: Experience
  declare renderer: WebGPURenderer

  //uniforms
  private radius = uniform(.7);
  private blurStregth = uniform(0.01);

  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.renderer = this.experience.renderer.instance as WebGPURenderer
  }
  init() {
    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();
    const outputNode = renderPipeline.outputNode as THREE.RenderOutputNode;

    const coords = uv().sub(.5).mul(2.);
    const radius = length(coords).add(this.radius)
    renderPipeline.outputNode = mix(hashBlur(outputNode, this.blurStregth,{repeats: 40}), color("#0D0E18"), radius)
    this.bindEvents();
  };
  bindEvents() {
    this.experience.canvas.addEventListener("click", this.openEyes)
  }
  openEyes = () => {
    gsap.to(this.radius, {
      value: -1,
      duration: 1.
    })
    gsap.to(this.blurStregth, {
      value: 0.,
      duration: 1.5
    })
  }
  destroy() {};
  update() {};
}
