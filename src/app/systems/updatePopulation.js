import p5 from 'p5'
import { Food } from '../types/food'
import { Creature, neighboursCreatures } from '../types/creature'
import compose from '../lib/compose'
import Flock from './flock'
import Collision from './collision'

const update = function(scene) {

    let flock = Flock(scene)()
    let collision = Collision(scene)()

    return () => {

        scene.population.forEach(one => {
            one.acceleration.mult(0)

            compose(
                collision.borderRollOver,
                flock.applyForces
            )(one)

            one.velocity.add(one.acceleration)
            one.position.add(one.velocity)
        })
    }
}

export default update