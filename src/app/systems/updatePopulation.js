import p5 from 'p5'
import { Food } from '../types/food'
import { Creature, neighboursCreatures } from '../types/creature'
import compose from '../lib/compose'
import Flock from './flock'
import Collision from './collision'
import AI from './aiNeural'

const update = function(scene) {

    let flock = Flock(scene)()
    let collision = Collision(scene)()
    let ai = AI(scene)

    const seekMouse = (one) => {
        const seekMouseForce = flock.seek(one, new p5.Vector(scene.canvas.mouseX, scene.canvas.mouseY))
        one.acceleration.add(seekMouseForce.mult(2))
        return one
    }

    let minOutput = 1
    let maxOutput = 0


    return () => {

        scene.population.forEach(one => {
            one.acceleration.mult(0)

            switch (scene.config.mode) {
                case 'flocking':
                    compose(
                        collision.borderRollOver,
                        seekMouse,
                        flock.applyForces
                    )(one)
                    break
                case 'neural':
                    const nai = ai(one.net)
                    nai.setInput([
                        (scene.canvas.mouseX - scene.config.center.x) / (scene.canvas.width / 2),
                        (scene.canvas.mouseY - scene.config.center.y)  / (scene.canvas.height / 2)
                    ])
                    const output = nai.calculate()
                    output.forEach(value => {
                        if (value > maxOutput) {
                            maxOutput = value
                        }
                        if (value < minOutput) {
                            minOutput = value
                        }
                    })
                    break
            }

            

            one.velocity.add(one.acceleration)
            one.position.add(one.velocity)
        })
    }
}

export default update