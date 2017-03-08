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
        generation: 1,
        id: 1,
        health: 300,
        sensors: [],
        velocity: false,
        net: {},
        fitness: 0,
        maxSpeed: 8,
        targetCreature: false,
        targetFood: false,
        acceleration: false
    }
}

export const resetCreature = (one) => {
    one.age = 0
    one.health = 300
    one.score = 0
    one.targetCreature = false
    one.targetFood = false
    one.selected = false
    
    return one
}

export const makeCreature = (x, y) => {
    return Creature(new p5.Vector(x,y))
}

export const makePopulation = (max, x, y) => {
    let result = []
    for(let i = 0 ; i < max ; i++) {
        const creature = makeCreature(x, y)
        identifyCreature(creature, result)
        result.push(creature)
    }
    return result
}

export const identifyCreature = (creature, population) => {
    if (population.length > 0) {
        creature.id = population.sort((a,b) => a.id > b.id ? -1 : 1)[0].id + 1
    }
}

export const makePopulationRandomPosition = (max, maxX, maxY) => {
    let result = []
    for(let i = 0 ; i < max ; i++) {
        const creature = makeCreature(Math.random() * maxX, Math.random() * maxY)
        identifyCreature(creature, result)
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

export const neighboursCreatures = (population, positionVector, maxDistance = false) => {
    return population.filter(one => {
        const distance = p5.Vector.dist(positionVector, one.position)
        return one.health > 0 && distance > 0 && distance < ( maxDistance ? maxDistance : Math.max(one.size, 10) )
    })
}

export const nearestCreature = (population, position) => {
    const nearest = population
        .filter(creature => creature.health > 0 ? true : false)
        .map(creature => ({
            dist: p5.Vector.dist(position, creature.position),
            creature: creature
        }))
        .filter(next => next.dist > 0 ? true : false)
        .sort((a,b) => a.dist > b.dist ? 1 : -1)
    
    return nearest.length > 0 ? nearest[0].creature : false
        
}

export const calculateFitness = (population) => {
    return population.map(one => {
        one.fitness = one.age + one.health
        return one
    })
}

export const initializeNeural = (population) => {
    return population.map(one => {
        one.net = new NeuralNet()
        return one
    })
}