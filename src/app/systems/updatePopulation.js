import p5 from 'p5'
import { Food, spawnFood } from '../types/food'
import { Creature, neighboursCreatures } from '../types/creature'
import compose from '../lib/compose'
import Flock from './flock'
import Collision from './collision'
import AI from './aiNeural'
import * as Cluster from '../types/cluster'
import curry from '../lib/curry'

const update = function(scene) {

    let flock = Flock(scene)()
    let collision = Collision(scene)()
    let ai = AI(scene)()

    const seekMouse = (one) => {
        const seekMouseForce = flock.seek(one, new p5.Vector(scene.canvas.mouseX, scene.canvas.mouseY))
        one.acceleration.add(seekMouseForce.mult(2))
        return one
    }
    
    const syncWithCluster = curry(Cluster.syncItemWithClusters)(scene.clusters)


    return () => {

        scene.population
            .filter(creature => creature.health > 0 ? true : false)
            .forEach(one => {
                one.acceleration.mult(0)
                one.age++
                one.health -= one.speed
                if (one.health <= 0) {
                    scene.simulation.last.starved++
                    if (scene.config.fertilize) {
                        spawnFood(scene.diet, one.position.x, one.position.y)
                    }
                } else {
                    switch (scene.config.mode) {
                        case 'flocking':
                            compose(
                                collision.borderRollOver,
                                seekMouse,
                                flock.applyForces
                            )(one)
                            one.velocity.add(one.acceleration)
                            one.velocity.limit(scene.config.maxSpeed)
                            break
                        case 'neural':
                            compose(
                                collision.borderRollOver,
                                //collision.borderKill,
                                syncWithCluster,
                                ai.xyBrain
                            )(one)
                            break
                    }
                    one.position.add(one.velocity)
                }
            })
    }
}

export default update