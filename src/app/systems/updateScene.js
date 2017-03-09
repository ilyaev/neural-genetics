import p5 from 'p5'
import { Food } from '../types/food'
import { Creature } from '../types/creature'
import updatePopulation from './updatePopulation'
import updateFood from './updateFood'
import genetics from './genetics'

const update = function(scene) {

    const populationUpdater = updatePopulation(scene)
    const foodUpdater = updateFood(scene)
    const geneticUpdater = genetics(scene)()

    let scale = 1

    return () => {

        for(let  i = 0 ; i < scale ; i++) {
            populationUpdater()
            foodUpdater()
            geneticUpdater.simulate()
        }
    }

}

export default update