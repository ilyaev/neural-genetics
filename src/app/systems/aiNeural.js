import { setNetInputValues, calculateNetOutput } from '../types/neural'
import p5 from 'p5'
import Flock from './flock'
import * as Cluster from '../types/cluster'
import curry from '../lib/curry'

const conditionAlive = (one) => one.health > 0 ? true : false

const ai = (scene) => {

    const flock = Flock(scene)()

    let maxDistance = false

    const setInput = (net, input) => {
        setNetInputValues(net, input)
    }

    const calculate = (net) => {
        calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const setupConstants = () => {
        if (!maxDistance) {
            maxDistance = p5.Vector.dist(new p5.Vector(0,0), new p5.Vector(scene.canvas.width, scene.canvas.height))
        }
    }

    const aliveCreatureCondition = (one) => one.health > 0 ? true : false

    const getNearestCreature = curry(Cluster.nearestItem)(scene.population)(scene.clusters)(aliveCreatureCondition)
    const getNearestFood = curry(Cluster.nearestItem)(scene.diet)(scene.foodClusters)(() => true)


    const xyBrain = (creature) => {

        setupConstants()

        const maxX = scene.canvas.width
        const maxY = scene.canvas.height
        const centerX = scene.config.center.x
        const centerY = scene.config.center.y
        const x = creature.position.x
        const y = creature.position.y

        //const nearest = nearestCreature(scene.population, creature.position)
        const nearest = getNearestCreature(creature.position)

        //const food = nearestFood(scene.diet, creature.position)
        const food = getNearestFood(creature.position)
        
        creature.targetCreature = nearest
        creature.targetFood = food

        let desired = new p5.Vector(0, 0)
        let desiredFood = new p5.Vector(0, 0)
        let distToFood = 0

        if (nearest) {
            desired = p5.Vector.sub(nearest.position, creature.position).setMag(1)
        }

        if (food) {
            distToFood = p5.Vector.dist(food.position, creature.position)
            if (distToFood < 5) {
                food.eaten = true
                scene.simulation.last.eaten++
                creature.score += 1
                creature.health += 150
            } else {
                desiredFood = p5.Vector.sub(food.position, creature.position).setMag(1)
            }
        }

        const input = [
            x < centerX ? 0 : (x - centerX) / (maxX / 2),
            x > centerX ? 0 : (centerX - x) / (maxX / 2),
            y < centerY ? 0 : (y - centerY) / (maxY / 2),
            y > centerY ? 0 : (centerY - y) / (maxY / 2),
            desired.x,
            desired.y,
            nearest ? 1 - p5.Vector.dist(nearest.position, creature.position) / maxDistance : 0,
            desiredFood.x,
            desiredFood.y,
            food ? 1 - distToFood / maxDistance : 0,
            Math.min(creature.age, 1200) / 600 - 1
        ]


        setInput(creature.net, input)
        const output = calculate(creature.net)
        let [vX, vY, speed] = output

        if (Math.abs(speed > 0.5)) {
            speed = 2
        } else {
            speed = 1
        }

        creature.speed = speed

        const vDesired = new p5.Vector(vX, vY)
        vDesired.normalize()
        vDesired.mult(scene.config.maxSpeed * speed)

        const steer = p5.Vector.sub(vDesired, creature.velocity)
        steer.limit(scene.config.steeringForce * speed)

        creature.acceleration = steer
        creature.velocity.add(creature.acceleration)



        // creature.acceleration = new p5.Vector(vX, vY).limit(scene.config.steeringForce * speed)
        // creature.velocity.add(creature.acceleration)
        // creature.velocity.limit(scene.config.maxSpeed * speed)
        
        return creature
    }



    return () => {
        return {
            setInput,
            calculate,
            xyBrain
        }
    }

    

}

export default ai