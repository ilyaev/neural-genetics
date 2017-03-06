import config from './config'
import { Food, makeDiet } from './types/food'
import { Creature, makePopulation, initializeVelocity, initializeAcceleration, makePopulationRandomPosition } from './types/creature'
import compose from './lib/compose'


const diet = makeDiet(config.foodcount, config.width, config.height)

// const population = compose(
//     initializeVelocity,
//     initializeAcceleration,
//     makePopulation
// ) (config.popcount, config.center.x, config.center.y)

const population = compose(
    initializeVelocity,
    initializeAcceleration,
    makePopulationRandomPosition
) (config.popcount, config.width, config.height)

const scene = {
    diet,
    population,
    config,
    canvas: null,
    active: true
}

export default scene