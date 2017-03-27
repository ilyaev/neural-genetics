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

const ui = scene.ui

var box = false
var ground = false

const showBox = (box, canvas) => {
    canvas.push()
        canvas.noFill()
        canvas.stroke(200)
        canvas.translate(box.body.position.x, box.body.position.y)
        canvas.rotate(box.body.angle)
        canvas.rectMode(canvas.CENTER)
        canvas.rect(0, 0, box.width, box.height)
        canvas.stroke(0, 200, 0)
        canvas.line(-box.width / 2, 0, -box.width / 2 - 10, 0)
        canvas.line(box.width / 2, 0, box.width / 2 + 10, 0)
        canvas.line(0, box.height / 2, 0, box.height / 2 + 10)
        canvas.line(0, -box.height / 2, 0, -box.height / 2 - 10)
    canvas.pop()
}

const jet = (dx, dy) => {
    const box = scene.ships[0]
    const angle = box.body.angle
    let v = new p5.Vector(dx, dy).rotate(angle).add(new p5.Vector(box.body.position.x, box.body.position.y))
    let vForce = p5.Vector.sub(new p5.Vector(box.body.position.x, box.body.position.y), new p5.Vector(v.x, v.y))
    vForce = vForce.setMag(0.05)
    Matter.Body.applyForce(box.body, {x: box.body.position.x, y: box.body.position.y - box.height}, vForce)
}

const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight)
        scene.canvas = p
    }

    p.draw = function() {
        
        updatePhysics()
        
        p.background('black')

        scene.boundaries.forEach(one => showBox(one, p))
        scene.ships.forEach(one => showBox(one, p))
    }

    p.mousePressed = (event) => {
        spawnShip(event.x, event.y)
    }

    p.keyPressed = (event) => {
        switch (event.key) {
            case 'a':
                jet(-1,0)
                break
            case 'd':
                jet(1,0)
                break
            case 'w':
                jet(0, -1)
                break
            case 's':
                jet(0, 1)
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