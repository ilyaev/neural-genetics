import p5 from 'p5'
import config from '../config'
import scene from '../scene'
import { NeuralNet } from '../../types/neural'

export const pixel2cell = (pixels) => Math.round(pixels / config.cellSize)


export const calcInputSize = () => {
    const result = Object.keys(config.inputSize).reduce((result, next) => {
        return result + (scene[next] ? config.inputSize[next] : 0)
    }, 0)

    return result
}

export const SnakeNeuralNet = (neuronsPerLevel = 7, hiddenLevels = 1, inputSize = 9) => NeuralNet(
    inputSize, // Input Size
    hiddenLevels, // Hidden Layers number
    neuronsPerLevel, // Hidden Layer size
    6, // Output Size
    () => Math.random() * 2 - 1
)



export const Snake = (position) => {
    return {
        position,
        cell: {
            x: pixel2cell(position.x),
            y: pixel2cell(position.y)
        },
        destCell: {
            x: pixel2cell(position.x),
            y: pixel2cell(position.y)
        },
        tail: [
            SnakeBody(new p5.Vector(position.x, position.y),new p5.Vector(position.x, position.y))
        ],
        length: 1,
        dx: 0,
        dy: 0,
        net: new SnakeNeuralNet(scene ? scene.neuronsPerLevel : 7, scene ? scene.hiddenLevels : 1, scene ? scene.inputSize : 9),
        velocity: new p5.Vector(0,0),
        destination: new p5.Vector(position.x, position.y),
        age: 0,
        health: config.cWidth + config.cHeight,
        id: -1,
        fitness: 0,
        score: 0,
        generation: 0,
        category: 'random',
        elitecount: 0,
        food: false,
        vCenter: new p5.Vector(0,0),
        vCenterDirection: new p5.Vector(0,0)
    }
}

export const SnakeBody = (position, destination) => {
    return {
        position,
        destination,
        cell: {
            x: pixel2cell(position.x),
            y: pixel2cell(position.y)
        },
        destCell: {
            x: pixel2cell(destination.x),
            y: pixel2cell(destination.y)
        },
        velocity: new p5.Vector(0,0)
    }
}


export const calculateFitness = (snakes) => {
    const maxDist = p5.Vector.dist(new p5.Vector(0,0), new p5.Vector(config.width, config.height))
    snakes.forEach(snake => {
        let distToFood = 0
        if (snake.food) {
            distToFood = p5.Vector.dist(snake.position, snake.food.position)
        }
        snake.fitness = snake.score * 100
        if (distToFood > 0) {
            snake.fitness += Math.round((distToFood / maxDist) * 100)
        }
    })
}

export const setDestination = (x, y, snake) => {
    snake.destination = new p5.Vector(x, y)
    snake.destCell.x = Math.round(x / config.cellSize)
    snake.destCell.y = Math.round(y / config.cellSize)

    snake.velocity = new p5.Vector(snake.destination.x - snake.position.x, snake.destination.y - snake.position.y).div(config.speed)
    
    snake.tail.reduce((prev, tail) => {
        tail.destination = new p5.Vector(prev.position.x, prev.position.y)
        tail.destCell.x = Math.round(prev.position.x / config.cellSize)
        tail.destCell.y = Math.round(prev.position.y / config.cellSize)
        tail.velocity = new p5.Vector(tail.destination.x - tail.position.x, tail.destination.y - tail.position.y).div(config.speed)
        return tail
    }, snake)
}

export const createSnake = (x, y) => {
    return Snake(new p5.Vector(x, y))
}

export const identifySnake = (creature, population) => {
    if (population.length > 0) {
        creature.id = population.sort((a,b) => a.id > b.id ? -1 : 1)[0].id + 1
    }
}

export const grow = (snake) => {
    let parent = snake.position
    if (snake.tail.length > 0) {
        parent = snake.tail[snake.tail.length - 1].position
    }
    snake.tail.push(SnakeBody(new p5.Vector(parent.x, parent.y), new p5.Vector(parent.x, parent.y)))
}

export const fittestSnake = (snakes) => {
    calculateFitness(snakes)
    let firstAlive = snakes.filter(snake => snake.health > 0 ? true : false)
    if (!firstAlive || firstAlive.length == 0) {
        return snakes[0]
    } else {
        firstAlive = firstAlive[0]
    }
    return snakes.filter(snake => snake.health > 0 ? true : false).reduce((result, next) => {
        return (next.health > 0 && next.fitness > result.fitness) ? next : result
    }, firstAlive)
}

export const nearestSnake = (population, position) => {
    const nearest = population
        .filter(creature => creature.health > 0 ? true : false)
        .map(creature => ({
            dist: p5.Vector.dist(position, creature.position),
            creature: creature
        }))
        .filter(next => next.dist > 0 ? true : false)
        .sort((a,b) => a.dist > b.dist ? 1 : -1)
    
    return nearest.length > 0 ? nearest[0].creature : false
        
}