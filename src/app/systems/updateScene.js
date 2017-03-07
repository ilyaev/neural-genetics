import p5 from 'p5'
import { Food } from '../types/food'
import { Creature } from '../types/creature'
import updatePopulation from './updatePopulation'
import updateFood from './updateFood'

const update = function(scene) {

    const populationUpdater = updatePopulation(scene)
    const foodUpdater = updateFood(scene)

    return () => {
        populationUpdater()
        foodUpdater()
    }

}

export default update