import config from './config'
import { Food, makeDiet } from './types/food'
import { 
    Creature, 
    makePopulation, 
    initializeVelocity, 
    initializeAcceleration, 
    initializeNeural,
    makePopulationRandomPosition 
} from './types/creature'
import compose from './lib/compose'


const diet = makeDiet(config.foodcount, config.width, config.height)

const populationNeural = compose(
    initializeNeural,
    initializeVelocity,
    initializeAcceleration,
    makePopulation
) (config.popcount, config.center.x, config.center.y)

const populationFlocking = compose(
    initializeVelocity,
    initializeAcceleration,
    makePopulationRandomPosition
) (config.popcount, config.width, config.height)

const scene = {
    diet,
    population: config.mode == 'flocking' ? populationFlocking : populationNeural,
    config,
    canvas: null,
    nnCanvas: null,
    selection: {
        creature: false
    },
    simulation: {
        last: {
            generation: 1,
            eaten: 0,
            starved: 0,
            maxFitness: 0,
            meanFitntess: 0
        },
        generation: 1,
        stats: []
    },
    ui: {
        neuralNet: true
    },
    active: true
}

export default scene