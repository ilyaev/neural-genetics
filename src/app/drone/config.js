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
        lifespan: 400
    },
    shipscount: 100,
    rightPanel,
    bottomPanel,
    shipWidth: 20,
    shipHeight: 30,
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
    }

}

configuration.center = {
    x: configuration.width / 2,
    y: configuration.height / 2
}

export default configuration