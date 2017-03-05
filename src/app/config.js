import p5 from 'p5'

const configuration = {

    popcount: 10,
    foodcount: 20,
    width: window.innerWidth,
    height: window.innerHeight,
    center: {
        x: 0,
        y: 0
    }

}

configuration.center = new p5.Vector(configuration.width / 2, configuration.height / 2)


export default configuration