import p5 from 'p5'
import { Food } from '../types/food'
import drawPopulation from './drawPopulation'
import drawFood from './drawFood'
import drawNeuralNet from './drawNeuralNet'
import drawGenetics from './drawGenetics'
import drawIdPanel from './drawIdPanel'

const draw = function(scene) {

    return () => {

        drawFood(scene.canvas, scene.diet)
        drawPopulation(scene.canvas, scene.population)
        
        
        if (scene.selection.creature) {
            if (scene.ui.neuralNet) {
                drawNeuralNet(scene.selection.creature.net, 'ID: ' + scene.selection.creature.id, scene.nnCanvas)
                scene.canvas.image(scene.nnCanvas, scene.config.width, 0)
            }
            drawIdPanel(scene.idCanvas, scene)
            scene.canvas.image(scene.idCanvas, scene.config.width, scene.nnCanvas.height)
        }

        if (scene.ui.genetics) {
            drawGenetics(scene.genCanvas, scene)
            scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)
        }
        
        scene.canvas.stroke(200)
        scene.canvas.noFill()
        scene.canvas.rect(0,0, scene.config.width, scene.config.height)
        



    }    

}

export default draw