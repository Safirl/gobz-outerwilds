import * as THREE from "three/webgpu"

/**
 * Returns a rounded rectangle shape geometry. Caution: If you want to modify the vertex, you should better create a plane geometry and add a SDF for rounded corners
 * @param x
 * @param y
 * @param width
 * @param height
 * @param radius
 * @returns created ShapeGeometry
 */
export const convertStandardMaterial = (originalMaterial: THREE.MeshStandardMaterial): THREE.MeshStandardNodeMaterial => {
  if (!originalMaterial || !(originalMaterial instanceof THREE.MeshStandardMaterial)) throw new Error(`${originalMaterial} is not a MeshStandardMaterial or is not valid`)

  const nodeMaterial = new THREE.MeshStandardNodeMaterial()

  nodeMaterial.map = originalMaterial.map
  nodeMaterial.roughnessMap = originalMaterial.roughnessMap
  nodeMaterial.metalnessMap = originalMaterial.metalnessMap
  nodeMaterial.aoMap = originalMaterial.aoMap
  nodeMaterial.normalMap = originalMaterial.normalMap
  nodeMaterial.emissiveMap = originalMaterial.emissiveMap
  nodeMaterial.alphaMap = originalMaterial.alphaMap
  nodeMaterial.aoMapIntensity = originalMaterial.aoMapIntensity
  nodeMaterial.bumpMap = originalMaterial.bumpMap
  nodeMaterial.bumpScale = originalMaterial.bumpScale
  nodeMaterial.displacementMap = originalMaterial.displacementMap
  nodeMaterial.transparent = originalMaterial.transparent
  nodeMaterial.color.copy(originalMaterial.color)
  nodeMaterial.emissive.copy(originalMaterial.emissive)
  nodeMaterial.emissiveIntensity = originalMaterial.emissiveIntensity
  nodeMaterial.roughness = originalMaterial.roughness
  nodeMaterial.metalness = originalMaterial.metalness
  nodeMaterial.opacity = originalMaterial.opacity
  nodeMaterial.side = originalMaterial.side
  nodeMaterial.alphaTest = originalMaterial.alphaTest
  nodeMaterial.vertexColors = originalMaterial.vertexColors
  nodeMaterial.normalScale.copy(originalMaterial.normalScale)

  return nodeMaterial
}
