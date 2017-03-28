import Box from './box'
import Matter from 'matter-js'
import { NeuralNet } from '../../types/neural'
import p5 from 'p5'

const Ship = (x, y, width = 20, height = 20) => {
    return {
        width,
        height,
        net: new LunarNeuralNet(),
        fuel: 300,
        age: 0,
        id: Math.round(Math.random() * 1000000),
        fitness: 0,
        jets: [
            [-1, 0],
            [1, 0],
            [0, 1],
            [0, -1]
        ].map(one => new Jet(one[0], one[1])),
        body: Matter.Bodies.rectangle(x, y, width, height, {mass: 20})
    }
}


const Jet = (dx, dy) => {
    return {
        dx,
        dy,
        force: 0
    }
}

export const LunarNeuralNet = (neuronsPerLevel = 5, hiddenLevels = 2, inputSize = 5) => NeuralNet(
    inputSize, // Input Size
    hiddenLevels, // Hidden Layers number
    neuronsPerLevel, // Hidden Layer size
    4, // Output Size
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

export default Ship