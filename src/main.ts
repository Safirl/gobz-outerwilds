import { Camera, Experience, OrbitCamera, TemplateWorld } from '@plugins/three-base-experience'
//@ts-ignore
import "./reset.css"
import ExpWorld from './three/World'
import sources from './three/sources'

const canvas = document.getElementById('three') as HTMLCanvasElement
canvas.style.width = '100%'
canvas.style.height = '100%'

const world = new ExpWorld()
const camera = new OrbitCamera()
const experience = new Experience(canvas, sources, camera, world)
await experience.init();
