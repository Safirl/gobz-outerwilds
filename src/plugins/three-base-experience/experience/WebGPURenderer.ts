import * as THREE from "three/webgpu";
import Experience from "./Experience";
import { pass } from "three/tsl";

/**
 * Instantiate a WebGPURenderTarget
 */

export default class GPURenderer {
  declare experience: Experience;
  declare canvas: Experience["canvas"];
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare camera: Experience["camera"];
  declare instance: THREE.WebGPURenderer;
  declare protected renderPipeline: THREE.RenderPipeline | null;

  constructor() {
    if (!Experience.instance)
      throw new Error(
        "Renderer initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating the Renderer.",
      );

    this.experience = Experience.instance;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.shadowMap.transmitted = true;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(0x000000);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    this.experience.renderer = this;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  // addComposerPass(
  //   pass: Pass,
  //   afterGammaCorrectionPass?: boolean,
  //   index?: number,
  // ) {
  //   if (!this.composer) {
  //     this.initializeComposer();
  //   }
  //   if (typeof index === "number") {
  //     this.composer?.insertPass(pass, index);
  //   } else if (!afterGammaCorrectionPass) {
  //     this.composer?.insertPass(pass, this.composer.passes.length - 1);
  //   } else {
  //     this.composer?.addPass(pass);
  //   }
  // }

  // removeComposerPass(pass: Pass) {
  //   if (!this.composer) return;
  //   this.composer.removePass(pass);
  // }

  initializeRenderPipeline() {
    if (this.renderPipeline) {
      console.warn("the composer has already been initialized");
      return;
    }
    this.renderPipeline = new THREE.RenderPipeline(this.instance);
    const scenePass = pass(this.scene, this.camera.instance);
    this.renderPipeline.outputNode = scenePass
  }

  getRenderPipeline = () => {
    if (!this.renderPipeline) {
      this.initializeRenderPipeline();
    }
    return this.renderPipeline!;
  };

  update() {
    if (this.renderPipeline) {
      this.renderPipeline.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
