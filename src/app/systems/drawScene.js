import p5 from 'p5'
import { Food } from '../types/food'
import drawPopulation from './drawPopulation'
import drawFood from './drawFood'
import drawNeuralNet from './drawNeuralNet'

const draw = function(scene) {

    return () => {
        // drawFood(scene.canvas, scene.diet)
        // drawPopulation(scene.canvas, scene.population)

        drawNeuralNet(scene.population[0].net, scene.canvas)

    }    

}

export default draw