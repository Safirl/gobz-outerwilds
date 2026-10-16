import type { Experience, GPURenderer, LifeTimeObject } from "@plugins/three-base-experience";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import * as THREE from "three/webgpu";

export default class PostProcess implements LifeTimeObject{
  declare private experience: Experience
  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(): void {
    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();
    const outputNode = renderPipeline.outputNode as THREE.RenderOutputNode;
    const bloomPass = bloom(outputNode);
    renderPipeline.outputNode = outputNode.add(bloomPass)
    bloomPass.threshold.value = 0.25
    bloomPass.strength.value = 1
  }
  update(): void {

  }
  destroy(): void {

  }
}
