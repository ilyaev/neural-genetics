import p5 from 'p5'

const rightPanel = {
    width: 300
}

const bottomPanel = {
    height: 200
}

const configuration = {
    speed: 1,
    simulation: {
        lifespan: 250000
    },
    snakescount: 200,
    rightPanel,
    bottomPanel,
    cellSize: 20,
    staleFactor: 3,
    width: window.innerWidth - rightPanel.width,
    height: window.innerHeight - bottomPanel.height,
    center: {
        x: 0,
        y: 0
    },
    colors: {
        food: [255, 0, 0],
        creature: [0, 200, 0],
        selected: [235, 117, 2],
        maxFitness: [235, 117, 2],
        meanFitness: [255,255,255],
        eaten: [220, 1, 40],
        starved: [61, 202, 1]
    }

}

const rX = Math.ceil(configuration.width / configuration.cellSize)
const dX = configuration.width - rX * configuration.cellSize
configuration.width = rX * configuration.cellSize
configuration.rightPanel.width += dX

const rY = Math.ceil(configuration.height / configuration.cellSize)
const dY = configuration.height - rY * configuration.cellSize
configuration.height = rY * configuration.cellSize
configuration.bottomPanel.height += dY

console.log(configuration)



configuration.cellRectParams = [-configuration.cellSize  / 2 + 1, -configuration.cellSize / 2 + 1, configuration.cellSize - 1, configuration.cellSize - 1]
configuration.clusterSize = Math.max(Math.ceil(Math.max(configuration.width, configuration.height) / 10), 100)
configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)

export default configuration