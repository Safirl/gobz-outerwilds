import { Actor, Debug, Experience, type LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import { mx_perlin_noise_float } from "three/src/nodes/materialx/MaterialXNoise.js";
import { float, mx_noise_float, uniform, uv, vec3, mul, mx_fractal_noise_float, time, negate, vec2, texture, smoothstep, remap, min, max, positionLocal, vec4, saturate, mx_fractal_noise_vec2, mix, billboarding, range, rotateUV, color } from "three/tsl";
//@ts-ignore
import { perlinNoise } from "tsl-textures";
import * as THREE from "three/webgpu"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Campfire implements LifeTimeObject{
  declare public mesh: THREE.Mesh
  declare fireMaterial: THREE.MeshStandardNodeMaterial
  declare smokeMaterial: THREE.MeshStandardNodeMaterial
  declare private experience: Experience
  declare private debug: Debug
  declare private debugFolder: ParametersGroup
  declare private campfire: Actor
  declare private light: THREE.PointLight

  /**
   * Uniforms fire
   */
  public distorsionScale = uniform(4.2)
  public distorsionStrength = uniform(.5)
  public distorsionSpeed = uniform(.8)
  public emissiveStrength = uniform(4.)
  public verticalScale = uniform(1.)
  public gradientAttenuation = uniform(.74)
  public fireCenterColor = uniform(new THREE.Color("#FFB659"))
  public fireOutColor = uniform(new THREE.Color("#FA5F06"))

  /**
   * Uniforms smoke
   */
  public smokeSpeed = uniform(.2);
  public smokeColor = uniform(new THREE.Color("#FFB659"))
  public smokeMaxLife = .1
  public smokeMinLife = .5


  constructor() {
    if (!Experience.instance) return;
    this.experience = Experience.instance

    this.mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial());
    this.mesh.castShadow = true;
    this.mesh.position.y = .25
    this.mesh.position.x = -.2
    this.mesh.position.x = -.2
    this.experience.scene.add(this.mesh)
    this.createSmoke()
    this.createPointLight()

    if (this.experience.debug.active) {
      this.setDebugObject()
    }
  }

  createSmoke = () => {
    const smokeTexture = this.experience.resources.items.smoke1Texture as THREE.Texture

    const lifeRange = range(this.smokeMinLife, this.smokeMaxLife);
    const offsetRange = range(new THREE.Vector3(- .3, .4, - .3), new THREE.Vector3(.3,.9, .4));
    const scaledTime = time.add(50).mul(this.smokeSpeed);

    const lifeTime = scaledTime.mul(lifeRange).mod(1);
    const scaleRange = range( .1, .4 );
    const rotateRange = range(.1, 4);

    const life = lifeTime.div(lifeRange);
    // const fakeLightEffect = positionLocal.y.oneMinus().max(0.2);
    const textureNode = texture(smokeTexture, rotateUV(uv(), scaledTime.mul(rotateRange)));
    const opacityNode = min(textureNode.a.mul(life.oneMinus()), .3);
    const smokeColor = mix(this.smokeColor.mul(.02), color(0x222222), positionLocal.y.mul(3).clamp());

    const smokeNodeMaterial = new THREE.SpriteNodeMaterial();
    smokeNodeMaterial.colorNode = smokeColor//mix(this.fireCenterColor, smokeColor, life.mul(2.5).min(1)).mul(fakeLightEffect);
    // smokeNodeMaterial.colorNode = mix(color(0xf27d0c), smokeColor, life.mul(2.5).min(1)).mul(fakeLightEffect);
    smokeNodeMaterial.opacityNode = opacityNode;
    smokeNodeMaterial.positionNode = offsetRange.mul(lifeTime);
    smokeNodeMaterial.scaleNode = scaleRange.mul(lifeTime.max(0.3));
    smokeNodeMaterial.depthWrite = false;

    const smokeInstancedSprite = new THREE.Mesh( new THREE.PlaneGeometry( 1., 1 ), smokeNodeMaterial );
		smokeInstancedSprite.scale.setScalar( 5 );
    smokeInstancedSprite.count = 200;
		smokeInstancedSprite.position.y = .3
		this.experience.scene.add( smokeInstancedSprite );
  }

  createPointLight = () => {
    this.light = new THREE.PointLight()
    this.light.color = this.fireCenterColor.value
    this.light.intensity = 8.
    this.light.distance = 25
    this.light.decay = 0.2
    this.light.castShadow = true
    this.light.position.y = 1.
    this.light.position.x = .5
    this.light.position.z = .5
    this.experience.scene.add(this.light);
  }

  createGeometry = () => {
    return new THREE.PlaneGeometry(1.5, 2.)
    // return new THREE.BoxGeometry(.5, .5, .5)
  }

  createMaterial = () => {
    this.fireMaterial = new THREE.MeshStandardNodeMaterial({
      transparent: true,
      depthWrite: false
    })

    const coords = uv().sub(.5).mul(2)
    const offsetTime = vec2(0, time.mul(this.distorsionSpeed).negate())
    const displacedCoords = coords.add(offsetTime).mul(this.distorsionScale)

    //remap to avoid values to low
    const distorsion = remap(mx_fractal_noise_float(displacedCoords), 0., 1., 0.6, 1.);

    const distorsionStrength = distorsion.sub(.5).mul(this.distorsionStrength).mul(uv().y)
    const distordedVec2 = vec2(0., distorsionStrength)
    const verticalScale = vec2(1, this.verticalScale)
    const verticalDisplacedUV = uv().add(distordedVec2).mul(verticalScale)

    const fireTexture = this.experience.resources.items.fireAlphaTexture as THREE.Texture
    const fireTextureNode = texture(fireTexture, verticalDisplacedUV);
    const emissiveStrength = fireTextureNode.r.mul(this.emissiveStrength)

    const gradient = mix(this.fireOutColor, this.fireCenterColor, emissiveStrength.mul(this.gradientAttenuation))
    const color = gradient.mul(emissiveStrength)
    const alpha = saturate(emissiveStrength)

    this.fireMaterial.colorNode = vec4(color, alpha)
    this.fireMaterial.vertexNode = billboarding()
    this.fireMaterial.depthWrite = true;

    return this.fireMaterial;
  }
  init = () => {
    this.campfire = new Actor(
      "campfire",
      this.experience.resources.items.campfireModel as GLTF,
      true,
      false,
    );
  };
  update = () => {};
  destroy = () => { };
  setDebugObject = () => {
    this.debug = this.experience.debug
    this.debugFolder = this.debug.inspector.createParameters("🔥 Fire");
    this.debugFolder.close()
    // this.debugFolder.add(this.noiseOctaves, "value", 0, 10, 1).name("noise octaves")
    this.debugFolder.add(this.distorsionScale, "value", 0., 10., 0.1).name("distorsion scale")
    this.debugFolder.add(this.distorsionStrength, "value", 0., 10., 0.1).name("distorsion strength")
    this.debugFolder.add(this.distorsionSpeed, "value", 0., 10., 0.1).name("distorsion speed")
    this.debugFolder.add(this.emissiveStrength, "value", 0., 10., 0.1).name("emissive strength")
    this.debugFolder.add(this.gradientAttenuation, "value", 0., 5., 0.01).name("gradient attenuation")
    this.debugFolder.addColor(this.fireCenterColor, "value").name("fire center color")
    this.debugFolder.addColor(this.fireOutColor, "value").name("fire out color")

    //smoke
    const smokeDebugFolder = this.debugFolder.addFolder("🌫️ Smoke");
    smokeDebugFolder.addColor(this.smokeColor, "value").name("smoke color")

    //light
    const lightDebugFolder = this.debugFolder.addFolder("🔅 light");
    lightDebugFolder.add(this.light, "intensity", 0., 20., .1)
    lightDebugFolder.add(this.light, "decay", 0., 20., .1)
    lightDebugFolder.add(this.light, "distance", 0., 200., .1)
  }
}
