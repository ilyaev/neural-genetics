import Box from './box'
import Matter from 'matter-js'
import { NeuralNet } from '../../types/neural'
import p5 from 'p5'

const Ship = (x, y, width = 20, height = 20) => {
    const id = 'sh' + Math.round(Math.random() * 1000000)
    return {
        width,
        active: true,
        height,
        net: new LunarNeuralNet(),
        target: null,
        fuel: 200,
        age: 0,
        id: id,
        fitness: 0,
        elitecount: 0,
        impact: {
            speed: 0
        },
        jets: [
            [-1, 0],
            [1, 0],
            [0, 1],
            //[0, -1]
        ].map(one => new Jet(one[0], one[1])),
        body: Matter.Bodies.rectangle(x, y, width, height, {
            mass: 50,
            id: id,
            label: 'ship',
            collisionFilter: {
                category: 0x0002,
                mask: 0x0001
            }
        })
    }
}


const Jet = (dx, dy) => {
    return {
        dx,
        dy,
        force: 0
    }
}

export const LunarNeuralNet = (neuronsPerLevel = 8, hiddenLevels = 3, inputSize = 5) => NeuralNet(
    inputSize, // Input Size
    hiddenLevels, // Hidden Layers number
    neuronsPerLevel, // Hidden Layer size
    3, // Output Size
    () => Math.random() * 2 - 1
)

export const nearestShip = (population, position) => {
    const nearest = population
        //.filter(creature => creature.health > 0 ? true : false)
        .map(creature => ({
            dist: p5.Vector.dist(position, new p5.Vector(creature.body.position.x, creature.body.position.y)),
            creature: creature
        }))
        .filter(next => next.dist > 0 ? true : false)
        .sort((a,b) => a.dist > b.dist ? 1 : -1)
    
    return nearest.length > 0 ? nearest[0].creature : false
        
}

export const calculateFitness = (ship) => {
    const maxDist = p5.Vector.dist(ship.target, new p5.Vector(0,0))
    const dist = p5.Vector.dist(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y))
    ship.fitness = maxDist - dist
    ship.fitness -= ship.impact.speed * (maxDist / 12)
    ship.fitness -= Math.abs(ship.body.angle) * maxDist

    if (dist > maxDist / 5) {
        ship.fitness -= maxDist / 2
    }
    return ship
}

export default Ship