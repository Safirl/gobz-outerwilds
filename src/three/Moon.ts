import { Actor, Debug, Experience, StaticObject, type LifeTimeObject } from "@plugins/three-base-experience";
import type { ParametersGroup } from "three/examples/jsm/inspector/tabs/Parameters.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three/webgpu"
import Tree from "./Tree";
import type { Textures } from "@plugins/three-base-experience/types/types";
import { float, Fn, mix, mx_fractal_noise_float, normalMap, remap, smoothstep, uniform, uv } from "three/tsl";
import { positionLocal } from "three/src/nodes/TSL.js";

export default class Moon extends StaticObject{
  declare private debug: Debug
  declare private debugFolder: ParametersGroup
  declare material: THREE.MeshStandardNodeMaterial;
  declare character: THREE.Object3D

  public treeTheta = { value: -3.14159265358979 }
  public treePhi = {value: 1.42}
  public radius = 60

  //uniforms
  public maskScale = uniform(.6)
  public smoothBlend = uniform(0.15)
  public offset = uniform(7.76)
  public spread = uniform(.5)

  constructor() {
    super()
    this.init()
  }

  init = () => {
    super.init()
    this.createTrees()
    this.createCharacter()
    this.setDebugObject()
  };

  createCharacter = () => {
    const character = new Actor("character", this.experience.resources.items.characterModel as GLTF, true, false)
    this.character = character.model
    character.model.position.set(-1.16, -0.09, -3.45)
    character.model.rotation.set(0, -1.51, 0)
  }

  createTrees = () => {
    new Tree(1.718,1.621,  this.radius, this.mesh.position, "tree 1", this.experience.resources.items.treeModel2 as GLTF, true, true)
    new Tree(1.914,0.1963,  this.radius, this.mesh.position, "tree 2", this.experience.resources.items.treeModel2 as GLTF, true, true)
    new Tree(1.81,-0.351,  this.radius, this.mesh.position, "tree 3", this.experience.resources.items.treeModel2 as GLTF, true, true)
    // new Tree(2.01,0.58,  this.radius, this.mesh.position, "tree 4", this.experience.resources.items.treeModel2 as GLTF, true, true)
    new Tree(1.914,1.129,  this.radius, this.mesh.position, "tree 5", this.experience.resources.items.treeModel2 as GLTF, true, true)
    new Tree(1.03,-3.00,  this.radius, this.mesh.position, "tree 6", this.experience.resources.items.treeModel2 as GLTF, true, true)
  }

  setGeometry(): void {
    super.setGeometry()
    this.geometry = new THREE.SphereGeometry(this.radius, 200, 200)
    const uvAttribute = this.geometry.attributes.uv;
    this.geometry.setAttribute('uv2', new THREE.BufferAttribute(uvAttribute.array, 2));
  }

  setTextures(): void {
    this.textures = []
    let grassTexture: Textures = {}
    grassTexture.color = this.experience.resources.items.grassColorTexture as THREE.Texture
    grassTexture.color.wrapS = THREE.RepeatWrapping;
    grassTexture.color.wrapT = THREE.RepeatWrapping;
    grassTexture.color.repeat = new THREE.Vector2(30., 30.)
    grassTexture.color.colorSpace = THREE.SRGBColorSpace

    grassTexture.normal = this.experience.resources.items.grassNormalTexture as THREE.Texture
    grassTexture.normal.wrapS = THREE.RepeatWrapping;
    grassTexture.normal.wrapT = THREE.RepeatWrapping;
    grassTexture.normal.repeat = new THREE.Vector2(30., 30.)
    grassTexture.normal.colorSpace = THREE.NoColorSpace

    grassTexture.roughness = this.experience.resources.items.grassRoughnessTexture as THREE.Texture
    grassTexture.roughness.wrapS = THREE.RepeatWrapping;
    grassTexture.roughness.wrapT = THREE.RepeatWrapping;
    grassTexture.roughness.repeat = new THREE.Vector2(30., 30.)

    // grassTexture.metalness = this.experience.resources.items.grassMetalnessTexture as THREE.Texture
    // grassTexture.metalness.wrapS = THREE.RepeatWrapping;
    // grassTexture.metalness.wrapT = THREE.RepeatWrapping;
    // grassTexture.metalness.repeat = new THREE.Vector2(30., 30.)

    grassTexture.aoMap = this.experience.resources.items.grassAoTexture as THREE.Texture
    grassTexture.aoMap.wrapS = THREE.RepeatWrapping;
    grassTexture.aoMap.wrapT = THREE.RepeatWrapping;
    grassTexture.aoMap.repeat = new THREE.Vector2(30., 30.)

    //ground
    let groundTexture: Textures = {}
    groundTexture.color = this.experience.resources.items.dirt2ColorTexture as THREE.Texture
    groundTexture.color.wrapS = THREE.RepeatWrapping;
    groundTexture.color.wrapT = THREE.RepeatWrapping;
    groundTexture.color.repeat = new THREE.Vector2(30., 30.)
    groundTexture.color.colorSpace = THREE.SRGBColorSpace

    groundTexture.normal = this.experience.resources.items.dirt2NormalTexture as THREE.Texture
    groundTexture.normal.wrapS = THREE.RepeatWrapping;
    groundTexture.normal.wrapT = THREE.RepeatWrapping;
    groundTexture.normal.repeat = new THREE.Vector2(30., 30.)
    groundTexture.normal.colorSpace = THREE.NoColorSpace

    groundTexture.roughness = this.experience.resources.items.dirt2RoughnessTexture as THREE.Texture
    groundTexture.roughness.wrapS = THREE.RepeatWrapping;
    groundTexture.roughness.wrapT = THREE.RepeatWrapping;
    groundTexture.roughness.repeat = new THREE.Vector2(30., 30.)

    groundTexture.aoMap = this.experience.resources.items.dirt2AoTexture as THREE.Texture
    groundTexture.aoMap.wrapS = THREE.RepeatWrapping;
    groundTexture.aoMap.wrapT = THREE.RepeatWrapping;
    groundTexture.aoMap.repeat = new THREE.Vector2(30., 30.)
    this.textures.push(groundTexture, grassTexture)
  }

  setMaterial(): void {
    this.material = new THREE.MeshStandardNodeMaterial({
      // map: this.textures[0].color,
      // normalMap: this.textures[0].normal,
      // roughnessMap: this.textures[0].roughness,
      // aoMap: this.textures[0].aoMap
      transparent: true
    })
    const repeatScale = 80.
    //grass texture
    const grassMap = new THREE.TextureNode(this.textures[1].color, uv().mul(repeatScale).fract())
    const grassNormal = new THREE.TextureNode(this.textures[1].normal, uv().mul(repeatScale).fract())
    const grassRoughness = new THREE.TextureNode(this.textures[1].roughness, uv().mul(repeatScale).fract())
    const grassMetalness = new THREE.TextureNode(this.textures[1].metalness, uv().mul(repeatScale).fract())
    const grassAo = new THREE.TextureNode(this.textures[1].aoMap, uv().mul(repeatScale).fract())

    //dirt
    const dirtMap = new THREE.TextureNode(this.textures[0].color, uv().mul(repeatScale).fract())
    const dirtNormal = new THREE.TextureNode(this.textures[0].normal, uv().mul(repeatScale).fract())
    const dirtRoughness = new THREE.TextureNode(this.textures[0].roughness, uv().mul(repeatScale).fract())
    // const dirtMetalness = new THREE.TextureNode(this.textures[0].metalness, uv().mul(repeatScale).fract())
    const dirtMetalness = float(0.)
    const dirtAo = new THREE.TextureNode(this.textures[0].aoMap, uv().mul(repeatScale).fract())

    //blendFactor
    const coords = positionLocal.remap(float(-1), float(1), float(0), float(1)).mul(float(this.maskScale))
    const blendFactor = remap(mx_fractal_noise_float(coords.add(this.offset), 2.).r, 0., 1., this.spread, 1.)

    //masks
    const maskMap = smoothstep(float(.5).sub(this.smoothBlend), float(.5).add(this.smoothBlend), blendFactor)

    this.material.colorNode = mix(dirtMap, grassMap, maskMap)
    this.material.roughnessNode = mix(dirtRoughness, grassRoughness, maskMap)
    this.material.metalnessNode = mix(dirtMetalness, grassMetalness, maskMap)
    this.material.aoNode = mix(dirtAo, grassAo, maskMap)
    this.material.normalNode = normalMap(mix(dirtNormal, grassNormal, maskMap))
  }

  setMesh(): void {
    super.setMesh()
    this.mesh.rotateX(Math.PI/4)
    this.mesh.position.y = -this.radius
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  setDebugObject = () => {
    if (!this.experience.debug.active) return;
    this.debug = this.experience.debug
    this.debugFolder = this.experience.debug.inspector.createParameters("🌍 Planet")
    // this.debugFolder.close()
    this.debugFolder.add(this.maskScale, "value", 0., 5., .01).name("mask scale")
    this.debugFolder.add(this.smoothBlend, "value", 0., .5, .01).name("smooth blend")
    this.debugFolder.add(this.offset, "value", 0., 10., .01).name("offset")
    this.debugFolder.add(this.spread, "value", 0., 1., .01).name("spread")

    const characterDebugFolder = this.debugFolder.addFolder("character")
    characterDebugFolder.add(this.character.position, "x", -10., 10., .01).name("posX")
    characterDebugFolder.add(this.character.position, "y", -10., 10., .01).name("posY")
    characterDebugFolder.add(this.character.position, "z", -10., 10., .01).name("posZ")

    characterDebugFolder.add(this.character.rotation, "x", -10., 10., .01).name("rotX")
    characterDebugFolder.add(this.character.rotation, "y", -10., 10., .01).name("rotY")
    characterDebugFolder.add(this.character.rotation, "z", -10., 10., .01).name("rotZ")

  }

  update = () => {};
  destroy = () => {};
}
