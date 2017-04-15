import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import config from './config'
import scene from './scene'
import sceneUpdater from './systems/updateScene'
import sceneDrawer from './systems/drawScene'


const updateScene = sceneUpdater(scene)
const drawScene = sceneDrawer(scene)

const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight)
        scene.canvas = p
    }

    p.draw = function() {
        if (scene.active) {
            updateScene()
            drawScene()
        }
    }

    p.keyPressed = function(event) {
        switch (event.key) {
        }
    }

}

export default class MainSketch {
    constructor(element) {
        this.element = element
        this.myp5 = new p5(sketch, this.element)
    }

}