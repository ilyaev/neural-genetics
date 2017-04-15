import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import dat from 'dat-gui'
import config from './config'
import scene, { addToWorld, updatePhysics,spawnShip, nextCurrentTarget } from './scene'
import sceneUpdater from './systems/updateScene'
import sceneDrawer from './systems/drawScene'
import mouseSelector from './systems/mouseSelection'
import sceneCollide from './systems/collideScene'
import Matter from 'matter-js'
import Box from './types/box'


const updateScene = sceneUpdater(scene)
const drawScene = sceneDrawer(scene)
const mouseSelection = mouseSelector(scene)()
const sceneCollider = sceneCollide(scene)

const ui = scene.ui

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
        scene.genCanvas = p.createGraphics(window.innerWidth, config.bottomPanel.height)
        scene.idCanvas = p.createGraphics(config.rightPanel.width, window.innerHeight - scene.genCanvas.height - scene.nnCanvas.height)
        scene.canvas = p
        Matter.Events.on(scene.engine, 'collisionStart', function (event) {
            event.pairs.forEach(sceneCollider)
        });
    }

    p.draw = function() {
        if (scene.active) {
            updateScene()
            drawScene()
        }
    }

    p.mouseClicked = (event) => {
        mouseSelection.pointSelect(new p5.Vector(event.x, event.y))
    }

    p.keyPressed = function(event) {
        switch (event.key) {
            case 'n':
                nextCurrentTarget()
                break
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
                scene.active = !scene.active
        }
        
    }

}

export default class MainSketch {
    constructor(element) {
        this.element = element
        this.myp5 = false
        this.setup()
        //this.setupGUI()
    }

    setup = function() {
        this.myp5 = new p5(sketch, this.element)
    }

    Restart = function() {
        //restartSketch(this.myp5)
    }

    setupGUI = () => {
        var gui = new dat.gui.GUI({
            autoPlace: false,
            width: 300
        })

        document.getElementById('moveGUI').append(gui.domElement)

        gui.add(scene, 'active').name('Active').listen()
        gui.add(ui, 'fantoms').name('Fantoms').listen()
        gui.add(scene, 'timeScale',1, 200).name('TimeScale').step(1).listen()
        gui.add(this, 'Restart').name('Restart Simulation')

        let folderNeural = gui.addFolder('Neural')
        folderNeural.add(scene, 'neuronsPerLevel', 1, 20).step(1).name('Nodes per Level')
        folderNeural.add(scene, 'hiddenLevels', 1, 4).step(1).name('Levels')
        folderNeural.open()

        // let folderNeuralInputs = folderNeural.addFolder('Input')
        // folderNeuralInputs.add(scene, 'iFoodV2').name('Food Direction')
        // folderNeuralInputs.add(scene, 'iSnakeCenterV2').name('Snake Center')
        // folderNeuralInputs.add(scene, 'iSnakeVelocityV2').name('Velocity')
        // folderNeuralInputs.add(scene, 'iSnakeAroundV4').name('Close Neighbours')
        // folderNeuralInputs.add(scene, 'iSnakeTailV2').name('Tail Direction')


        let folderGenetics = gui.addFolder('Genetics')
        folderGenetics.add(scene, 'mutationRate',0.01, 0.5).step(0.01).listen().name('Mutation Rate')
        folderGenetics.add(scene, 'eliteRate', 0.01, 0.9).step(0.05).listen().name('Elite Rate')
        folderGenetics.add(scene, 'randomRate', 0, 0.5).step(0.05).listen().name('Random Rate')
        folderGenetics.open()
        

        

        


        this.gui = gui

    }

}