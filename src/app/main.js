import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import config from './config'
import { Food, makeDiet } from './types/food'
import sceneDrawer from './systems/drawScene'
import { Creature, makePopulation, initializeVelocity, initializeAcceleration, initializeNeural } from './types/creature'
import sceneUpdater from './systems/updateScene'
import mouseSelector from './systems/mouseSelection'
import scene from './scene'
import dat from 'dat-gui'

const drawScene = sceneDrawer(scene)
const updateScene = sceneUpdater(scene)
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
            case "z":
                scene.timeScale = scene.timeScale == 1 ? 50 : 1
                console.log('scale - ', scene.timeScale + 'x')
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
        //  this.setupGUI()
    }

    setup = function() {
        this.myp5 = new p5(sketch, this.element)
    }

    setupGUI = () => {
        var gui = new dat.gui.GUI()
        var obj = {
            message: 'Hello World',
            displayOutline: false,
            maxSize: 6.0,
            speed: 5,
            height: 10,
            noiseStrength: 10.2,
            growthSpeed: 0.2,
            type: 'three',
            explode: function () {
            alert('Bang!');
            },
            color0: "#ffae23", // CSS string
            color1: [ 0, 128, 255 ], // RGB array
            color2: [ 0, 128, 255, 0.3 ], // RGB with alpha
            color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
        };
        gui.remember(obj)
        gui.add(obj, 'message');
        gui.add(obj, 'displayOutline');
        gui.add(obj, 'explode');
        gui.add(obj, 'maxSize').min(-10).max(10).step(0.25);
        gui.add(obj, 'height').step(5); // Increment amount
        // Choose from accepted values
        gui.add(obj, 'type', [ 'one', 'two', 'three' ] );
        // Choose from named values
        gui.add(obj, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 } );
        var f1 = gui.addFolder('Colors');
        f1.addColor(obj, 'color0');
        f1.addColor(obj, 'color1');
        f1.addColor(obj, 'color2');
        f1.addColor(obj, 'color3');
        var f2 = gui.addFolder('Another Folder');
        f2.add(obj, 'noiseStrength');
        var f3 = f2.addFolder('Nested Folder');
        f3.add(obj, 'growthSpeed');

        this.gui = gui
    }


}