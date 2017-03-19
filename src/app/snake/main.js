import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import dat from 'dat-gui'
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
            case 'p':
                scene.active = !scene.active
                break;
            default:
                //scene.active = !scene.active
        }
        
    }

    p.mouseClicked = function(event, a, b) {
        mouseSelection.pointSelect(new p5.Vector(event.x, event.y))
    }

}

export default class MainSketch {
    constructor(element) {
        this.element = element
        this.myp5 = false
        this.setup()
        this.setupGUI()
    }

    setup = function() {
        this.myp5 = new p5(sketch, this.element)
    }

    setupGUI = () => {
        var gui = new dat.gui.GUI({
            autoPlace: false
        })
        document.getElementById('moveGUI').append(gui.domElement)

        gui.add(scene, 'active').listen()
        gui.add(scene, 'timeScale',1, 200).step(1).listen()
        gui.add(config, 'speed',{
            Fast: 1,
            Normal: 5,
            Slow: 10
        })

        let folderNeural = gui.addFolder('Neural')
        folderNeural.add(scene, 'aiStrategy',0, 2).step(1)
        folderNeural.open()

        let folderGenetics = gui.addFolder('Genetics')
        folderGenetics.add(scene, 'mutationRate',0.01, 0.5).step(0.01).listen()
        folderGenetics.add(scene, 'eliteRate', 0.1, 0.9).step(0.05).listen()
        folderGenetics.add(scene, 'randomRate', 0, 0.5).step(0.05).listen()
        folderGenetics.open()

        


        this.gui = gui

    }

}