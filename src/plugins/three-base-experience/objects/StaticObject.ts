import * as THREE from "three/webgpu";
import type Resources from "../utils/Resources";
import Experience from "../experience/Experience";
import type { LifeTimeObject, Textures } from "../types/types";

/**
 * Base class to create static object, such as floor or walls. It uses a Mesh standard material
 */
export default abstract class StaticObject implements LifeTimeObject {
  protected scene: THREE.Scene;
  declare experience: Experience
  declare resources: Resources;
  declare geometry: THREE.BufferGeometry;
  declare textures: Textures[];
  declare material: THREE.NodeMaterial;
  declare mesh: THREE.Mesh;
  declare receiveShadows: boolean;
  declare castShadow: boolean;
  private id: string = crypto.randomUUID();

  constructor(
    textures?: Textures[],
    receiveShadows: boolean = false,
    castShadow: boolean = false,
  ) {
    if (!Experience.instance)
      throw new Error(
        "StaticObject initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating a StaticObject.",
      );
    this.experience = Experience.instance

    if (textures) {
      this.textures = textures;
    }
    this.receiveShadows = receiveShadows;
    this.castShadow = castShadow;

    this.scene = Experience.instance.scene;
    this.resources = Experience.instance.resources;
  }

  getId(): string {
    return this.id;
  }

  init() {
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }
  update() {}
  destroy() {}

  /**
   * Override this function to set the geometry
   */
  setGeometry() {
    // console.log(rhis)
  }

  /**
   * Called when the textures are set. If the texture object is valid, it will set the corresponding texture for the object.
   * Otherwise it is possible de override this function and set other textures.
   */
  setTextures() {
    if (!this.textures || !this.textures[0]) {
      return;
    }
    this.textures[0].color.colorSpace = THREE.SRGBColorSpace;
    this.textures[0].color.repeat.set(1.5, 1.5);
    this.textures[0].color.wrapS = THREE.RepeatWrapping;
    this.textures[0].color.wrapT = THREE.RepeatWrapping;

    if (this.textures[0].normal) {
      this.textures[0].normal.colorSpace = THREE.SRGBColorSpace;
      this.textures[0].normal.repeat.set(1.5, 1.5);
      this.textures[0].normal.wrapS = THREE.RepeatWrapping;
      this.textures[0].normal.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures[0].displacement) {
      // this.textures[0].displacement.colorSpace = THREE.SRGBColorSpace;
      this.textures[0].displacement.repeat.set(1.5, 1.5);
      this.textures[0].displacement.wrapS = THREE.RepeatWrapping;
      this.textures[0].displacement.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures[0].roughness) {
      // this.textures[0].roughness.colorSpace = THREE.SRGBColorSpace;
      this.textures[0].roughness.repeat.set(1.5, 1.5);
      this.textures[0].roughness.wrapS = THREE.RepeatWrapping;
      this.textures[0].roughness.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures[0].aoMap) {
      // this.textures[0].aoMap.colorSpace = THREE.SRGBColorSpace;
      this.textures[0].aoMap.repeat.set(1.5, 1.5);
      this.textures[0].aoMap.wrapS = THREE.RepeatWrapping;
      this.textures[0].aoMap.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures[0].metalness) {
      // this.textures[0].metalness.colorSpace = THREE.SRGBColorSpace;
      this.textures[0].metalness.repeat.set(1.5, 1.5);
      this.textures[0].metalness.wrapS = THREE.RepeatWrapping;
      this.textures[0].metalness.wrapT = THREE.RepeatWrapping;
    }
  }

  setMaterial() {
    this.material = new THREE.MeshStandardNodeMaterial(
      this.textures
        ? {
            map: this.textures[0].color,
            normalMap: this.textures[0].normal,
            aoMap: this.textures[0].aoMap,
            metalnessMap: this.textures[0].metalness,
            roughnessMap: this.textures[0].roughness,
            displacementMap: this.textures[0].displacement,
          }
        : {},
    );
  }

  setMesh() {
    if (!this.geometry || !this.material)
      console.warn(
        "Can't instantiate mesh: Geometry or material is not valid for",
        this,
      );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.rotation.x = -Math.PI * 0.5;
    // this.mesh.position.y = -0.001;
    this.mesh.receiveShadow = this.receiveShadows;
    this.mesh.castShadow = this.castShadow;
    this.scene.add(this.mesh);
  }
}
