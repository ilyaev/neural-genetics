import p5 from 'p5'
import { Food, resupplyFood } from '../types/food'
import { Creature } from '../types/creature'

const update = function(scene) {

    return () => {
        resupplyFood(scene.diet, scene.config.width, scene.config.height)    
    }
    
}

export default update