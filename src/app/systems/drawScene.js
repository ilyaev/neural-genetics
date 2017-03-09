import p5 from 'p5'
import { Food } from '../types/food'
import drawPopulation from './drawPopulation'
import drawFood from './drawFood'
import drawNeuralNet from './drawNeuralNet'
import drawGenetics from './drawGenetics'

const draw = function(scene) {

    return () => {

        
        
        if (scene.selection.creature && scene.ui.neuralNet) {
            drawNeuralNet(scene.selection.creature.net, 'ID: ' + scene.selection.creature.id, scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, 10, 10)
        }

        if (scene.ui.genetics) {
            drawGenetics(scene.genCanvas, scene)
            scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)
        }
        
        

        drawFood(scene.canvas, scene.diet)
        drawPopulation(scene.canvas, scene.population)



    }    

}

export default draw