import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import dat from 'dat-gui'
import config from './config'
import scene, { addToWorld, updatePhysics,spawnShip } from './scene'
import sceneUpdater from './systems/updateScene'
import sceneDrawer from './systems/drawScene'
import mouseSelector from './systems/mouseSelection'
import Matter from 'matter-js'
import Box from './types/box'


const updateScene = sceneUpdater(scene)
const drawScene = sceneDrawer(scene)
const mouseSelection = mouseSelector(scene)()

const restartSketch = (p) => {
    initScene()
    resetSimulation()
    scene.nnCanvas = p.createGraphics(config.rightPanel.width, 300)
    scene.genCanvas = p.createGraphics(window.innerWidth, config.bottomPanel.height)
    scene.idCanvas = p.createGraphics(config.rightPanel.width, window.innerHeight - scene.genCanvas.height - scene.nnCanvas.height)
}

const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight)
        scene.nnCanvas = p.createGraphics(config.rightPanel.width, 300)
        scene.canvas = p
    }

    p.draw = function() {
        updateScene()
        updatePhysics()
        drawScene()
    }

    p.mouseClicked = (event) => {
        mouseSelection.pointSelect(new p5.Vector(event.x, event.y))
    }

    p.keyPressed = (event) => {
        switch (event.key) {
            case 'n':
                spawnShip(Math.random() * scene.config.width, Math.random() * scene.config.height)    
                scene.selection.ship = scene.ships[scene.ships.length - 1]
                break
            case 'm':
                spawnShip(scene.config.center.x, scene.config.center.y)
                scene.selection.ship = scene.ships[scene.ships.length - 1]
                break
        }
    }

}

export default class MainSketch {
    constructor(element) {
        this.element = element
        this.myp5 = false
        this.setup()
    }

    setup = function() {
        this.myp5 = new p5(sketch, this.element)
    }

}