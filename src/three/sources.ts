import type { Source } from "@plugins/three-base-experience";

const sources: Source[] = [
  // {
  //   name: "environmentMapTexture",
  //   type: "cubeTexture",
  //   path: [
  //     "textures/environmentMap/px.jpg",
  //     "textures/environmentMap/nx.jpg",
  //     "textures/environmentMap/py.jpg",
  //     "textures/environmentMap/ny.jpg",
  //     "textures/environmentMap/pz.jpg",
  //     "textures/environmentMap/nz.jpg",
  //   ],
  // },
  {
    name: "environmentMapTexture1",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/1/px.png",
      "textures/environmentMap/1/nx.png",
      "textures/environmentMap/1/py.png",
      "textures/environmentMap/1/ny.png",
      "textures/environmentMap/1/pz.png",
      "textures/environmentMap/1/nz.png",
    ],
  },
  {
    name: "spaceEnvTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/space/px.png",
      "textures/environmentMap/space/nx.png",
      "textures/environmentMap/space/py.png",
      "textures/environmentMap/space/ny.png",
      "textures/environmentMap/space/pz.png",
      "textures/environmentMap/space/nz.png",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "moonColorTexture",
    type: "texture",
    path: "textures/moon/moon_04_diff.jpg",
  },
  {
    name: "moonARMTexture",
    type: "texture",
    path: "textures/moon/moon_04_arm.jpg",
  },
  {
    name: "moonNormalTexture",
    type: "texture",
    path: "textures/moon/moon_04_nor.jpg",
  },
  {
    name: "fireAlphaTexture",
    type: "texture",
    path: "textures/fire/flame_03.png",
  },
  {
    name: "smoke1Texture",
    type: "texture",
    path: "textures/fire/smoke_01.png",
  },
  {
    name: "smoke2Texture",
    type: "texture",
    path: "textures/fire/smoke_04.png",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "models/Fox/glTF/Fox.gltf",
  },
  {
    name: "treeModel",
    type: "gltfModel",
    path: "models/pine/scene.gltf",
  },
  {
    name: "treeModel2",
    type: "gltfModel",
    path: "models/pine2/PineeTree.gltf",
  },
  {
    name: "campfireModel",
    type: "gltfModel",
    path: "models/campfire/scene.gltf",
  },

  //stylized ground
  {
    name: "dirtColorTexture",
    type: "texture",
    path: "textures/ground_02_1k/ground_02_color_1k.png",
  },
  {
    name: "dirtNormalTexture",
    type: "texture",
    path: "textures/ground_02_1k/ground_02_normal_gl_1k.png",
  },
  {
    name: "dirtRoughnessTexture",
    type: "texture",
    path: "textures/ground_02_1k/ground_02_roughness_1k.png",
  },
  {
    name: "dirtAoTexture",
    type: "texture",
    path: "textures/ground_02_1k/ground_02_ambient_occlusion_1k.png",
  },

  //stylized ground 2
  {
    name: "dirt2ColorTexture",
    type: "texture",
    path: "textures/ground_with_rocks_01_1k/ground_with_rocks_01_color_1k.png",
  },
  {
    name: "dirt2NormalTexture",
    type: "texture",
    path: "textures/ground_with_rocks_01_1k/ground_with_rocks_01_normal_gl_1k.png",
  },
  {
    name: "dirt2RoughnessTexture",
    type: "texture",
    path: "textures/ground_with_rocks_01_1k/ground_with_rocks_01_roughness_1k.png",
  },
  {
    name: "dirt2AoTexture",
    type: "texture",
    path: "textures/ground_with_rocks_01_1k/ground_with_rocks_01_ambient_occlusion_1k.png",
  },
  //grass
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/ground_03_1k/ground_03_color_1k.png",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/ground_03_1k/ground_03_normal_gl_1k.png",
  },
  {
    name: "grassRoughnessTexture",
    type: "texture",
    path: "textures/ground_03_1k/ground_03_roughness_1k.png",
  },
  {
    name: "grassAoTexture",
    type: "texture",
    path: "textures/ground_03_1k/ground_03_ambient_occlusion_1k.png",
  },
  //grass2
  {
    name: "grass2ColorTexture",
    type: "texture",
    path: "textures/grass_with_rocks_01_1k/grass_with_rocks_01_color_1k.png",
  },
  {
    name: "grass2NormalTexture",
    type: "texture",
    path: "textures/grass_with_rocks_01_1k/grass_with_rocks_01_normal_gl_1k.png",
  },
  {
    name: "grass2RoughnessTexture",
    type: "texture",
    path: "textures/grass_with_rocks_01_1k/grass_with_rocks_01_roughness_1k.png",
  },
  {
    name: "grass2AoTexture",
    type: "texture",
    path: "textures/grass_with_rocks_01_1k/grass_with_rocks_01_ambientocclusion_1k.png",
  },

  //grass3
  {
    name: "grass3ColorTexture",
    type: "texture",
    path: "textures/ground_05_1k/ground_05_baseColor_1k.png",
  },
  {
    name: "grass3NormalTexture",
    type: "texture",
    path: "textures/ground_05_1k/ground_05_normal_gl_1k.png",
  },
  {
    name: "grass3RoughnessTexture",
    type: "texture",
    path: "textures/ground_05_1k/ground_05_roughness_1k.png",
  },
  {
    name: "grass3MetalnessTexture",
    type: "texture",
    path: "textures/ground_05_1k/ground_05_metallic_1k.png",
  },
  {
    name: "grass3AoTexture",
    type: "texture",
    path: "textures/ground_05_1k/ground_05_ambientOcclusion_1k.png",
  },
];

export default sources;
