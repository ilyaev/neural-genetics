import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import config from './config'
import scene from './scene'
import sceneUpdater from './systems/updateScene'
import sceneDrawer from './systems/drawScene'
import mouseSelector from './systems/mouseSelection'


const updateScene = sceneUpdater(scene)
const drawScene = sceneDrawer(scene)
const mouseSelection = mouseSelector(scene)()


const sketch = function(p) {

    p.setup = function() {
        p.createCanvas(window.innerWidth, window.innerHeight)
        scene.nnCanvas = p.createGraphics(config.rightPanel.width, 300)
        scene.genCanvas = p.createGraphics(window.innerWidth, config.bottomPanel.height)
        scene.idCanvas = p.createGraphics(config.rightPanel.width, window.innerHeight - scene.genCanvas.height - scene.nnCanvas.height)
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
            case 'a':
                scene.timeScale = scene.timeScale == 1 ? 150 : 1
                break
            case 'z':
                scene.timeScale = scene.timeScale == 1 ? 50 : 1
                break
            case 'x':
                scene.timeScale = scene.timeScale == 1 ? 20 : 1
                break 
            case 'c':
                scene.timeScale = scene.timeScale == 1 ? 10 : 1
                break
            case 'v':
                scene.timeScale = scene.timeScale == 1 ? 5 : 1
                break          
            case 'f':
                scene.ui.fantoms = !scene.ui.fantoms;
                break;          
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