import { Camera, Experience, OrbitCamera, TemplateWorld } from '@plugins/three-base-experience'
//@ts-ignore
import "./style.css"
import ExpWorld from './three/World'
import sources from './three/sources'
import ExperienceCamera from './three/Camera'

const canvas = document.getElementById('three') as HTMLCanvasElement
canvas.style.width = '100%'
canvas.style.height = '100%'

const world = new ExpWorld()
const camera = new ExperienceCamera()
const experience = new Experience(canvas, sources, camera, world)
await experience.init();
