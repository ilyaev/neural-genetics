import Matter from 'matter-js'


const Box = (x, y, width, height, options = {}) => {
    return {
        width,
        height,
        body: Matter.Bodies.rectangle(x, y, width, height, options)
    }
}

export default Box