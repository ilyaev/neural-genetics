import { setNetInputValues, calculateNetOutput } from '../types/neural'
import p5 from 'p5'
import Flock from './flock'
import * as Cluster from '../types/cluster'
import curry from '../lib/curry'

const conditionAlive = (one) => one.health > 0 ? true : false

const getDistanceVector = (p1, p2) => {
    const x1 = p1.x
    const y1 = p1.y
    const x2 = p2.x
    const y2 = p2.y

    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const dist = Math.sqrt(dx*2 + dy*2)

    const fn = y2 < y1 ? dy / (dist*dist) : 0
    const fw = x2 < x1 ? dx / (dist*dist) : 0
    const fe = x2 > x1 ? dx / (dist*dist) : 0
    const fs = y2 > y1 ? dy / (dist*dist) : 0

    return [fn, fe, fs, fw].map(one => one)
}

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
    const healtyFoodCondition = (one) => one.eaten ? false : true

    const getNearestCreature = curry(Cluster.nearestItem)(scene.population)(scene.clusters)(aliveCreatureCondition)
    const getNearestFood = curry(Cluster.nearestItem)(scene.diet)(scene.foodClusters)(healtyFoodCondition)

    const polarInput = (creature, nearest, food) => {
        return [
            food ? p5.Vector.dist(creature.position, food.position) / 20 - 5 : 0,
            food ? p5.Vector.sub(food.position, creature.position).heading() / 3.14 : 0
        ]   
    }


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
        let distToEnemy = 0

        if (nearest) {
            distToEnemy = p5.Vector.dist(nearest.position, creature.position)
            if (distToEnemy < 5) {
                if (creature.score > nearest.score) {
                    creature.score += 1
                    creature.health += 150
                    nearest.health = 0
                } else if (creature.score < nearest.score) {
                    creature.health = 0
                    nearest.score += 1
                    nearest.helath += 150
                }
            }
            desired = p5.Vector.sub(creature.position, nearest.position).setMag(1)
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

        let input = [
            // x < centerX ? -1 : (x - centerX) / (maxX / 2),
            // x > centerX ? -1 : (centerX - x) / (maxX / 2),
            // y < centerY ? -1 : (y - centerY) / (maxY / 2),
            // y > centerY ? -1 : (centerY - y) / (maxY / 2),
            x / maxX,
            y / maxY,
            desired.x,
            desired.y,
            //nearest ? distToEnemy / 20 - 5 : 0,
            nearest ? 1 - Math.min(0.9, distToEnemy / 100) : 0,
            nearest ? (nearest.score > creature.score ? -1 : 1) : 0, 
            desiredFood.x,
            desiredFood.y,
            //food ? distToFood / 20 - 5 : 0,
            food ? 1 - Math.min(0.9, distToFood / 100) : 0,
            //Math.min(creature.age, 1200) / 600 - 1
        ]

        // const input = getDistanceVector(creature.position, food ? food.position : {x: 0, y: 0})
        //     .concat(getDistanceVector(creature.position, nearest ? nearest.position : {x:0,y:0}))
        
       // input = polarInput(creature, nearest, food)


        setInput(creature.net, input)
        const output = calculate(creature.net)
        let [vX, vY, speed] = output

        if (Math.abs(speed > 0.5)) {
            speed = 2
        } else {
            speed = 1
        }

        creature.speed = speed

        // const vDesired = new p5.Vector(vX, vY)
        // vDesired.normalize()
        // vDesired.mult(scene.config.maxSpeed * speed)

        // const steer = p5.Vector.sub(vDesired, creature.velocity)
        // steer.limit(scene.config.steeringForce * speed)

        // creature.acceleration = steer
        // creature.velocity.add(creature.acceleration)



        creature.acceleration = new p5.Vector(vX, vY)
        creature.acceleration.mult(speed)
        creature.velocity.add(creature.acceleration)
        creature.velocity.limit(scene.config.maxSpeed * speed)
        
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