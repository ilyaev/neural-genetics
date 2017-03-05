import p5 from 'p5'
import { Food } from '../types/food'
import { Creature } from '../types/creature'
import updatePopulation from './updatePopulation'
import updateFood from './updateFood'

const update = function(scene) {

    return () => {
        updatePopulation(scene)()
        updateFood(scene)()
    }

}

export default update