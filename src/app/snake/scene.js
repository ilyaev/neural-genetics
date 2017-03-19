import config from './config'
import compose from '../lib/compose'
import * as Cluster from '../types/cluster'
import * as Snake from './types/snake'
import * as Food from './types/food'

const snakes = []
const diet = []

const foodX = Math.random() * config.width
const foodY = Math.random() * config.height

for(let i = 0 ; i < config.snakescount ; i++) {
    const snake = Snake.createSnake(config.center.x, config.center.y)
    snake.id = (i + 1)
    snakes.push(snake)
    Food.spawnFood(diet, foodX, foodY, snake.id)
}

snakes[0].selected = true

const scene = {
    timeScale: 1,
    aiStrategy: config.aiStrategy,
    config,
    snakes,
    diet,
    canvas: null,
    selection: {
        snake: snakes[0]
    },
    mutationRate: 0.1,
    eliteRate: 0.2,
    randomRate: 0.1,
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
        genetics: true,
        fantoms: false
    },
    active: true
}



export default scene