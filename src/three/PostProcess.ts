import type { Experience, GPURenderer, LifeTimeObject } from "@plugins/three-base-experience";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { emissive, float, vec3, vec4 } from "three/tsl";
import * as THREE from "three/webgpu";

export default class PostProcess implements LifeTimeObject{
  declare private experience: Experience
  declare public bloomOutput: THREE.TextureNode
  constructor(experience: Experience) {
    this.experience = experience;
  }

  init(): void {
    const renderer = this.experience.renderer as GPURenderer;
    const renderPipeline = renderer.getRenderPipeline();
    renderer.addMrtOutputNode('bloomIntensity', float(0.));

    const sceneOutput = renderer.scenePass.getTextureNode('output')
    const bloomIntensity = renderer.scenePass.getTextureNode('bloomIntensity').r

    const bloomPass = bloom(sceneOutput.mul(bloomIntensity));
    bloomPass.threshold.value = 0.25
    bloomPass.strength.value = 1

    //@ts-ignore
    this.bloomOutput = sceneOutput.add(bloomPass);
    this.bloomOutput.toInspector();
    renderPipeline.outputNode = this.bloomOutput
    renderPipeline.needsUpdate = true;
  }
  update(): void {

  }
  destroy(): void {

  }
}
