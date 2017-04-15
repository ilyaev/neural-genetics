import Box from './box'
import Matter from 'matter-js'
import { NeuralNet } from '../../types/neural'
import p5 from 'p5'

export const LunarNeuralNet = (neuronsPerLevel = 7, hiddenLevels = 1, inputSize = 9) => NeuralNet(
    inputSize, // Input Size
    hiddenLevels, // Hidden Layers number
    neuronsPerLevel, // Hidden Layer size
    3, // Output Size
    () => Math.random() * 2 - 1
)

const Ship = (x, y, width = 20, height = 20) => {
    const id = 'sh' + Math.round(Math.random() * 1000000)
    return {
        width,
        active: true,
        height,
        net: new LunarNeuralNet(),
        category: 'noob',
        target: null,
        fuel: 150,
        score: 0,
        age: 0,
        id: id,
        started: false,
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
    ship.fitness = ship.score
    return ship
}

export default Ship