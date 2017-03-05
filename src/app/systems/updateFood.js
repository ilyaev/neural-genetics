import p5 from 'p5'
import { Food } from '../types/food'
import { Creature } from '../types/creature'

const update = function(scene) {

    return () => {
        scene.diet.forEach(one => {
            one.position.x += (Math.random()*6 - 3)
            one.position.y += (Math.random()*6 - 3)
        })    
    }
    
}

export default update