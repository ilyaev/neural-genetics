import p5 from 'p5'

const mode = 'neural'
// const mode = 'flocking'

const configuration = {
    mode: 'flocking',
    popcount: 100,
    foodcount: 50,
    popspawn: 'random',
    width: window.innerWidth,
    height: window.innerHeight,
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
    simulation: {
        lifespan: 1000
    },
    colors: {
        food: [255, 0, 0],
        creature: [255, 255, 255]
    }

}

configuration.clusterSize = Math.max(Math.ceil(Math.max(configuration.width, configuration.height) / 10), 100)
configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)

const nnConfiguration = Object.assign({}, configuration, {
    mode: 'neural',
    popcount: 100,
    popspawn: 'center'
})

let defConf = configuration

if (mode == 'neural') {
    defConf = nnConfiguration
}

export default defConf