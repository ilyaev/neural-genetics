import p5 from 'p5'
import { Food } from '../types/food'
import drawPopulation from './drawPopulation'
import drawFood from './drawFood'
import drawNeuralNet from './drawNeuralNet'

const draw = function(scene) {

    return () => {

        
        
        if (scene.selection.creature && scene.ui.neuralNet) {
            drawNeuralNet(scene.selection.creature.net, 'ID: ' + scene.selection.creature.id, scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, 10, 10)
        }

        drawPopulation(scene.canvas, scene.population)
        drawFood(scene.canvas, scene.diet)

    }    

}

export default draw