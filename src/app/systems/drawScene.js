import p5 from 'p5'
import { Food } from '../types/food'
import drawPopulation from './drawPopulation'
import drawFood from './drawFood'

const draw = function(scene) {

    return () => {
        drawFood(scene.canvas, scene.diet)
        drawPopulation(scene.canvas, scene.population)
    }    

}

export default draw