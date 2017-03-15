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
import * as Cluster from './types/cluster'


const diet = makeDiet(config.foodcount, config.width, config.height)

const populationNeural = compose(
    initializeNeural,
    initializeVelocity,
    initializeAcceleration,
    makePopulationRandomPosition
) (config.popcount, config.width, config.height)


const scene = {
    diet,
    timeScale: 1,
    population: populationNeural,
    clusters: [],
    foodClusters: [],
    config,
    canvas: null,
    nnCanvas: null,
    idCanvas: null,
    genCanvas: null,
    selection: {
        creature: false
    },
    simulation: {
        last: {
            generation: 1,
            eaten: 0,
            starved: 0,
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

Cluster.buildClusters(scene.clusters, scene.population, config.width, config.height, config.clusterSize)

Cluster.buildClusters(scene.foodClusters, scene.diet, config.width, config.height, config.clusterSize)
diet.forEach(one => Cluster.syncItemWithClusters(scene.foodClusters, one))

export default scene