import { neighboursCreatures } from '../types/creature'
import p5 from 'p5'

const flock = (scene) => {

    const seek = (creature, target) => {
        const desired = p5.Vector.sub(target, creature.position)
        desired.normalize()
        desired.mult(scene.config.flocking.maxSpeed)

        const steer = p5.Vector.sub(desired, creature.velocity)
        steer.limit(scene.config.flocking.steeringForce)
        return steer
    }

    const cohesion = (creature) => {
        const result = neighboursCreatures(scene.population, creature.position, scene.config.flocking.cohesionRadius)
            .reduce((sum, next) => {
                sum.v.add(next.position)
                sum.c += 1
                return sum
            }, {v: new p5.Vector(0,0), c: 0})

        if (result.c > 0) {
            result.v.div(result.c)
            return seek(creature, result.v)
        } else {
            return result.v
        }
    }

    const separate = (creature) => {
        const result = neighboursCreatures(scene.population, creature.position, scene.config.flocking.separationRadius)
            .reduce((sum, next) => {
                
                const diff = p5.Vector.sub(creature.position, next.position)
                diff.normalize()
                diff.div(p5.Vector.dist(creature.position, next.position))
                sum.v.add(diff)
                sum.c += 1

                return sum

            }, {v: new p5.Vector(0,0), c: 0})

        const steer = result.v
        if (result.c > 0) {
            steer.div(result.c)
            if (steer.mag() > 0) {
                steer.normalize()
                steer.mult(scene.config.flocking.maxSpeed)
                steer.sub(creature.velocity)
                steer.limit(scene.config.flocking.steeringForce)
            }
            return steer
        } else {
            return steer
        }
    }

    const align = (creature) => {
        const result = neighboursCreatures(scene.population, creature.position, scene.config.flocking.alignRadius)
            .reduce((sum, next) => {

                sum.v.add(next.velocity)
                sum.c += 1

                return sum

            }, {v: new p5.Vector(0,0), c: 0})

        const sum = result.v

        if (result.c > 0) {

            sum.div(result.c)
            sum.normalize()
            sum.mult(scene.config.flocking.maxSpeed) //maxspeed

            const steer = p5.Vector.sub(sum, creature.velocity)
            steer.limit(scene.config.flocking.steeringForce) // steering force
            
            return steer

        } else {
            return sum
        }
    }

    const applyForces = (creature) => {
        creature.velocity.add(align(creature).mult(scene.config.flocking.multipliers.align))
        creature.velocity.add(separate(creature).mult(scene.config.flocking.multipliers.separate))
        creature.velocity.add(cohesion(creature).mult(scene.config.flocking.multipliers.cohesion))
        return creature
    }

    return () => ({
        align,
        seek,
        applyForces
    })
}

export default flock