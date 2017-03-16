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
        lifespan: 300
    },
    snakescount: 50,
    rightPanel,
    bottomPanel,
    cellSize: 10,
    width: window.innerWidth - rightPanel.width,
    height: window.innerHeight - bottomPanel.height,
    center: {
        x: 0,
        y: 0
    },
    colors: {
        food: [255, 0, 0],
        creature: [0, 200, 0]
    }

}
configuration.cellRectParams = [-configuration.cellSize  / 2 + 1, -configuration.cellSize / 2 + 1, configuration.cellSize - 1, configuration.cellSize - 1]
configuration.clusterSize = Math.max(Math.ceil(Math.max(configuration.width, configuration.height) / 10), 100)
configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)

export default configuration