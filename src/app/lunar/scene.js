import config from './config'
import compose from '../lib/compose'
import Matter from 'matter-js'
import Ship from './types/ship'
import Boundary from './types/box'
import { replace } from '../lib/array'
import p5 from 'p5'



export const initScene = () => {
    scene.engine = scene.Engine.create()
    scene.world = scene.engine.world

    setupShips()
    setupStatics()
    scene.selection.ship = scene.ships[0]
}

let currentTarget = false

let currentStart = {
    x: config.center.x,
    y: config.center.y * 0.25
}
let noiseSeed = 0
let startNoise = 50

export const nextCurrentTarget = () => {
    let nX = Math.random() * (config.width - 100) + 50
    let sX = Math.random() * (config.width - 100) + 50
    if (scene.canvas) {
        nX = scene.canvas.map(scene.canvas.noise(noiseSeed),0,1, 50, config.width - 50)
        sX = scene.canvas.map(scene.canvas.noise(startNoise),0,1, 50, config.width - 50)
    }
    currentTarget = new p5.Vector(nX, config.height - 20)
    currentStart = new p5.Vector(sX, config.center.y * 0.1 + config.center.y * Math.random()*0.1)
    noiseSeed += 0.3
    startNoise += Math.random() * 0.5
}

export const putNewFleet = (ships) => {

    //nextCurrentTarget()

    scene.World.remove(scene.world, scene.world.bodies.filter(one => one.label == 'ship'))

    ships = ships.map(ship => {
        const net = ship.net
        const fitness = ship.fitness
        const category = ship.category
        const newShip = buildNewShip(currentStart.x, currentStart.y)
        newShip.net = net
        newShip.fitness = fitness
        newShip.category = category
        addToWorld(newShip.body)
        return newShip
    })

    replace(scene.ships, ships)
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

    const commonOpts = {
        isStatic: true,
        label: 'wall'
    }

    scene.boundaries = [
        new Boundary(config.center.x, config.height - 20, config.width - 20, 40, Object.assign({}, commonOpts, {label: 'floor'})),
        new Boundary(5, config.center.y, 10, config.height, commonOpts),
        new Boundary(config.width - 5, config.center.y, 10, config.height, commonOpts),
        new Boundary(config.center.x, 5, config.width, 10, commonOpts)
    ]

    addToWorld(scene.boundaries.map(one => one.body))
}

const setupShips = () => {
    scene.ships.length = 0
    for(let i = 0 ; i < config.shipscount ; i++) {
        spawnShip(config.center.x, config.center.y * 0.5)
    }
}


export const buildNewShip = (x, y) => {
    const ship = new Ship(x, y, config.shipWidth, config.shipHeight)
    if (!currentTarget) {
        nextCurrentTarget()
    }
    ship.target = currentTarget
    return ship
}

export const spawnShip = (x, y) => {
    const ship = buildNewShip(x, y)
    scene.ships.push(ship)
    addToWorld(ship.body)
}

export const removeShip = (ship) => {
    replace(scene.ships, scene.ships.filter(one => {
        if (one.id == ship.id) {
            scene.World.remove(scene.world, one.body)
            return false
        } else {
            return true
        }
    }))
}

export const deactivateShip = (ship, floor = true) => {
    if (!ship.active) {
        return
    }
    ship.fuel = 0
    ship.active = false
    ship.impact = {
        speed: floor ? ship.body.speed : 100
    }
    Matter.Sleeping.set(ship.body, true)
}

initScene()

export default scene