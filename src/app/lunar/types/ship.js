import Box from './box'
import Matter from 'matter-js'

const Ship = (x, y, width = 20, height = 20) => {
    return {
        width,
        height,
        jets: [
            [-1, 0],
            [1, 0],
            [0, 1],
            [0, -1]
        ].map(one => new Jet(one[0], one[1])),
        body: Matter.Bodies.rectangle(x, y, width, height, {})
    }
}


const Jet = (dx, dy) => {
    return {
        dx,
        dy,
        force: 0
    }
}

export default Ship