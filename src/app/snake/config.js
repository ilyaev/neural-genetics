import p5 from 'p5'
//import * as Snake from './types/snake'

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
    snakescount: 100,
    aiStrategy: 3,
    rightPanel,
    bottomPanel,
    cellSize: 20,
    halfCellSize: 10,
    staleFactor: 7,
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
    },
    inputSize: {
        iFoodV2: 3,
        iSnakeCenterV2: 2,
        iSnakeVelocityV2: 2,
        iSnakeAroundV4: 4,
        iSnakeTailV2: 2,
    }

}

export const updateCellSize = (cellSize) => {

    rightPanel.width = 300
    bottomPanel.height = 200
    configuration.width = window.innerWidth - rightPanel.width
    configuration.height = window.innerHeight - bottomPanel.height
    
    const rX = Math.ceil(configuration.width / cellSize)
    const dX = configuration.width - rX * cellSize

    configuration.width = rX * cellSize
    configuration.rightPanel.width += dX

    const rY = Math.ceil(configuration.height / cellSize)
    const dY = configuration.height - rY * cellSize

    configuration.height = rY * cellSize
    configuration.bottomPanel.height += dY

    configuration.cellRectParams = [-cellSize  / 2 + 1, -cellSize / 2 + 1, cellSize - 1, cellSize - 1]
    configuration.clusterSize = Math.max(Math.ceil(Math.max(configuration.width, configuration.height) / 10), 100)
    configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)
    configuration.halfCellSize = Math.round(cellSize / 2)
    configuration.cWidth = Math.round(configuration.width / cellSize)
    configuration.cHeight = Math.round(configuration.height / cellSize)
    configuration.cellSize = cellSize
}

updateCellSize(configuration.cellSize)


export default configuration