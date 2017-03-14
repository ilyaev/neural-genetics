import p5 from 'p5'

const rightPanel = {
    width: 300
}

const bottomPanel = {
    height: 200
}

const configuration = {
    mode: 'neural',
    popcount: 100,
    initialHealth: 500,
    popspawn: 'center',
    foodcount: 50,
    simulation: {
        lifespan: 1000
    },
    rightPanel,
    bottomPanel,
    width: window.innerWidth - rightPanel.width,
    height: window.innerHeight - bottomPanel.height,
    center: {
        x: 0,
        y: 0
    },
    maxSpeed: 3,
    steeringForce: 0.1,
    flocking: {
        alignRadius: 150,
        maxSpeed: 8,
        steeringForce: 0.05,
        separationRadius: 30,
        cohesionRadius: 150,
        multipliers: {
            separate: 2,
            align:  1,
            cohesion: 1
        }
    },
    colors: {
        food: [255, 0, 0],
        creature: [255, 255, 255]
    }

}

configuration.clusterSize = Math.max(Math.ceil(Math.max(configuration.width, configuration.height) / 10), 100)
configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)

export default configuration