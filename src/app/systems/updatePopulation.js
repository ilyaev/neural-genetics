import p5 from 'p5'
import { Food } from '../types/food'
import { Creature } from '../types/creature'
import compose from '../lib/compose'

const update = function(scene) {

    const collision = (one) => {
        
        if (one.position.x > scene.config.width) {
            one.position.x = 0
        } else if (one.position.x < 0) {
            one.position.x = scene.config.width
        }

        if (one.position.y > scene.config.height) {
            one.position.y = 0
        } else if (one.position.y < 0) {
            one.position.y = scene.config.height
        }

        return one
    }

    const applyForces = (one) => {
        one.velocity.add(one.acceleration)
        one.position.add(one.velocity)
        return one
    }


    return () => {
        scene.population.forEach(one => {
            one = compose(
                collision,
                applyForces
            )(one)
        })
    }
}

export default update