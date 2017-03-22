import config from './config'
import compose from '../lib/compose'
import * as Cluster from '../types/cluster'
import * as Snake from './types/snake'
import * as Food from './types/food'

const snakes = []
const diet = []



export const initScene = () => {
    const foodX = Math.random() * config.width
    const foodY = Math.random() * config.height

    snakes.length = 0
    diet.length = 0
    
    if (scene) {
        scene.inputSize = Snake.calcInputSize()
    }

    for(let i = 0 ; i < config.snakescount ; i++) {
        const snake = Snake.createSnake(config.center.x, config.center.y)
        snake.id = (i + 1)
        snakes.push(snake)
        Food.spawnFood(diet, foodX, foodY, snake.id)
    }
}

export const resetSimulation = () => {
    scene.simulation = {
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
    }
}

initScene()

snakes[0].selected = true

const scene = {
    timeScale: 1,
    nextCellSize: config.cellSize,
    aiStrategy: config.aiStrategy,
    neuronsPerLevel: 7,
    hiddenLevels: 1,
    iFoodV2: true,
    iSnakeCenterV2: true,
    iSnakeVelocityV2: true,
    iSnakeAroundV4: true,
    iSnakeTailV2: true,
    inputSize: 12,
    config,
    snakes,
    diet,
    canvas: null,
    selection: {
        snake: snakes[0],
        genetics: false
    },
    mutationRate: 0.1,
    eliteRate: 0.2,
    randomRate: 0.05,
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