import { Experience, GPURenderer, type LifeTimeObject } from "@plugins/three-base-experience";
import { color, mix, mrt, output, pass, texture } from "three/tsl";
import type { WebGPURenderer } from "three/webgpu";
import * as THREE from "three/webgpu"

export default class WakeUpTransition implements LifeTimeObject {
  declare experience: Experience
  declare renderer: WebGPURenderer
  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance
    this.renderer = this.experience.renderer.instance as WebGPURenderer
  }
  init() {
    // const mrtNode = mrt({
    //   output: output
    // })
    // mrtNode.setBlendMode("NormalBlending", blend)
    // const scenePass = pass(this.experience.scene, this.experience.camera.instance)

    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();
    const outputNode = renderPipeline.outputNode as THREE.RenderOutputNode;

    const transTexture = this.experience.resources.items.portalTexture as THREE.Texture
    // outputNode.toInspector();
    renderPipeline.outputNode = mix(color("#0D0E18"), outputNode, texture(transTexture).r)
  };
  destroy() {};
  update() {};
}
