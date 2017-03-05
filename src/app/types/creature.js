import p5 from 'p5'

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

export const initializeVelocity = (population) => {
    return population.map(one => {
        one.velocity = new p5.Vector(Math.random() - 0.5, Math.random() - 0.5)
        return one
    })
}

export const initializeAcceleration = (population) => {
    return population.map(one => {
        one.acceleration = new p5.Vector(Math.random() - 0.5, Math.random() - 0.5)
        one.acceleration.limit(0.05)
        return one
    })
}