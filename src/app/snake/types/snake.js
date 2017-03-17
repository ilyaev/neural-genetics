import p5 from 'p5'
import config from '../config'
import { NeuralNet } from '../../types/neural'

export const SnakeNeuralNet = () => NeuralNet(
    7, // Input Size
    1, // Hidden Layers number
    5, // Hidden Layer size
    3, // Output Size
    () => Math.random() * 2 - 1
)

export const Snake = (position) => {
    return {
        position,
        tail: [
            SnakeBody(new p5.Vector(position.x, position.y),new p5.Vector(position.x, position.y))
        ],
        length: 1,
        dx: 0,
        dy: 0,
        net: new SnakeNeuralNet(),
        velocity: new p5.Vector(0,0),
        destination: new p5.Vector(position.x, position.y),
        age: 0,
        health: 100,
        id: -1,
        fitness: 0,
        score: 0,
        generation: 0,
        category: 'random',
        elitecount: 0,
        food: false
    }
}

export const SnakeBody = (position, destination) => {
    return {
        position,
        destination,
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
    snake.velocity = new p5.Vector(snake.destination.x - snake.position.x, snake.destination.y - snake.position.y).div(config.speed)
    
    snake.tail.reduce((prev, tail) => {
        tail.destination = new p5.Vector(prev.position.x, prev.position.y)
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