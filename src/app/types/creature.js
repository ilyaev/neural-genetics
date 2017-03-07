import p5 from 'p5'
import NeuralNet from './neural'

export const Sensor = (host, position) => {
    return {
        host,
        srcPosition: sensor.position,
        position
    }
}

export const Creature = (position) => {
    return {
        position,
        size: 5,
        age: 0,
        score: 0,
        health: 100,
        sensors: [],
        velocity: false,
        net: {},
        acceleration: false
    }
}

export const makePopulation = (max, x, y) => {
    let result = []
    for(let i = 0 ; i < max ; i++) {
        const creature = Creature(new p5.Vector(x,y))
        result.push(creature)
    }
    return result
}

export const makePopulationRandomPosition = (max, maxX, maxY) => {
    let result = []
    for(let i = 0 ; i < max ; i++) {
        const creature = Creature(new p5.Vector(Math.random() * maxX, Math.random() * maxY))
        result.push(creature)
    }
    return result
}

export const initializeVelocity = (population) => {
    return population.map(one => {
        one.velocity = new p5.Vector(Math.random() - 0.5, Math.random() - 0.5)
        return one
    })
}

export const initializeAcceleration = (population) => {
    return population.map(one => {
        one.acceleration = new p5.Vector(0,0)
        return one
    })
}

export const neighboursCreatures = (population, positionVector, maxDistance) => {
    return population.filter(one => {
        const distance = p5.Vector.dist(positionVector, one.position)
        return distance > 0 && distance < maxDistance
    })
}

export const initializeNeural = (population) => {
    return population.map(one => {
        one.net = new NeuralNet()
        return one
    })
}