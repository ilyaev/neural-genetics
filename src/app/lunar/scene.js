import config from './config'
import compose from '../lib/compose'
import Matter from 'matter-js'
import Ship from './types/ship'
import Boundary from './types/box'

export const initScene = () => {
    scene.engine = scene.Engine.create()
    scene.world = scene.engine.world

    setupShips()
    setupStatics()
    scene.selection.ship = scene.ships[0]
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

export const addToWorld = (bodies) => {
    scene.World.add(scene.world, bodies)
}

export const updatePhysics = () => {
    scene.Engine.update(scene.engine)
}

const scene = {
    timeScale: 1,
    neuronsPerLevel: 7,
    hiddenLevels: 1,
    inputSize: 9,
    config,
    ships: [],
    boundaries: [],
    canvas: null,
    selection: {
        genetics: false,
        ship: false,
        generation: 0
    },
    Engine: Matter.Engine,
    Render: Matter.Render,
    World: Matter.World,
    Bodies: Matter.Bodies,
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

const setupStatics = () => {

    scene.boundaries = [
        new Boundary(config.center.x, config.height - 20, config.width - 20, 40, {isStatic: true}),
        new Boundary(5, config.center.y, 10, config.height, {isStatic: true}),
        new Boundary(config.width - 5, config.center.y, 10, config.height, {isStatic: true}),
        new Boundary(config.center.x, 5, config.width, 10, {isStatic: true})
    ]

    addToWorld(scene.boundaries.map(one => one.body))
}

const setupShips = () => {
    scene.ships = []
    spawnShip(config.center.x, config.center.y)
}

export const spawnShip = (x, y) => {
    const ship = new Ship(x, y, config.shipWidth, config.shipHeight)
    scene.ships.push(ship)
    addToWorld(ship.body)
}

initScene()

export default scene