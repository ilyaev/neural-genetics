import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import config from './config'
import { Food, makeDiet } from './types/food'
import sceneDrawer from './systems/drawScene'
import { Creature, makePopulation, initializeVelocity, initializeAcceleration } from './types/creature'
import sceneUpdater from './systems/updateScene'
import scene from './scene'


const drawScene = sceneDrawer(scene)
const updateScene = sceneUpdater(scene)

const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(config.width, config.height)
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

    p.keyPressed = function() {
        scene.active = !scene.active
    }

    p.mouseClicked = function() {
        initializeAcceleration(scene.population)
        initializeVelocity(scene.population)
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