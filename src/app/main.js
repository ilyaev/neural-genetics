import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import config from './config'
import { Food, makeDiet } from './types/food'
import sceneDrawer from './systems/drawScene'
import { Creature, makePopulation, initializeVelocity, initializeAcceleration, initializeNeural } from './types/creature'
import sceneUpdater from './systems/updateScene'
import mouseSelector from './systems/mouseSelection'
import scene from './scene'


const drawScene = sceneDrawer(scene)
const updateScene = sceneUpdater(scene)
const mouseSelection = mouseSelector(scene)()

const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(config.width, config.height)
        scene.nnCanvas = p.createGraphics(600, 500)
        scene.canvas = p
    }

    p.draw = function() {
        
        if (!scene.active) {
            return
        }

        p.background('black')

        updateScene()
        drawScene()
    }

    p.keyPressed = function(event) {
        switch (event.key) {
            case "r":
                scene.active = true
                initializeNeural(scene.population)
                break
            case "n":
                scene.ui.neuralNet = !scene.ui.neuralNet
                break
            case "s":
                console.log('SCENE', scene)
                break
            case "l":
                console.log('LASTGEN', scene.simulation.last)
                break
            case "c":
                console.clear()
                break
            default:
                scene.active = !scene.active

        }
        
    }

    p.mouseClicked = function(event, a, b) {
        mouseSelection.pointSelect(new p5.Vector(event.x, event.y))
        scene.active = true
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