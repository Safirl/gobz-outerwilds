import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import * as THREE from "three/webgpu";
import type Debug from "../utils/Debug";

export interface Source {
	name: string;
	type: string;
	path: string[] | string;
}

/**
 * Lifetime interface. Enables to call specific function when the experience inits, updates and destroys an object.
 */
export interface LifeTimeObject {
	init(): void;
	update(): void;
  destroy(): void;

  setDebugObject?(): void;
  debugFolder?: ParametersGroup
  debug?: Debug
}

export interface Textures {
	color: THREE.Texture;
	normal?: THREE.Texture;
	displacement?: THREE.Texture;
	roughness?: THREE.Texture;
	aoMap?: THREE.Texture;
	metalness?: THREE.Texture;
}
