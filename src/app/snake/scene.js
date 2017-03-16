import config from './config'
import compose from '../lib/compose'
import * as Cluster from '../types/cluster'
import * as Snake from './types/snake'
import * as Food from './types/food'

const snakes = []
const diet = []

for(let i = 0 ; i < config.snakescount ; i++) {
    const snake = Snake.createSnake(config.center.x, config.center.y)
    snake.id = (i + 1)
    snakes.push(snake)
    Food.spawnFood(diet, Math.random() * config.width, Math.random() * config.height, snake.id)
}

const scene = {
    timeScale: 1,
    config,
    snakes,
    diet,
    canvas: null,
    selection: {
        creature: false
    },
    simulation: {
        last: {
            generation: 1,
            eaten: 0,
            maxFitness: 0,
            meanFitness: 0,
            age: 0,
            lifespan: 1000
        },
        generation: 1,
        stats: [],
        mutations: 0
    },
    ui: {
        neuralNet: true,
        genetics: true
    },
    active: true
}

export default scene