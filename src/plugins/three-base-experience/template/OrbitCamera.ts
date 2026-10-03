import * as THREE from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Camera from "../experience/Camera";

export default class OrbitCamera extends Camera {
	declare controls: OrbitControls;

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			1000
    );
		this.instance.position.set(1.75, 0.67, 1.73);
    // this.instance.rotation.set(-0.18, 0.78, 0.13);
		super.setInstance();
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0,0.5,0)

    // this.controls.addEventListener("change", (e) => {
    //   console.log(this.instance.rotation
    //   )		})
	}

	update() {
    this.controls.update();
	}

	destroy(): void {
		this.controls.dispose();
	}
}
