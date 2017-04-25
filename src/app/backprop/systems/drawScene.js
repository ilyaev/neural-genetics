import p5 from 'p5'
import compose from '../../lib/compose'
import drawNeuralNet from '../../systems/drawNeuralNet'
import { XORNet } from '../types/neural'

const draw = function(scene) {

    const config = scene.config

    const setup = (canvas) => {
        canvas.background(0)
        return canvas
    }

    const drawNN = (canvas) => {
        drawNeuralNet(scene.net, '', scene.nnCanvas, 1)
        scene.canvas.image(scene.nnCanvas, 0, 0)
        scene.net = new XORNet()
        return canvas
    }

    const drawDebug = function(canvas) {
        canvas.push()
            canvas.fill(255)
            canvas.text("FPS: " + canvas.frameRate().toFixed(2), 10, 20);
        canvas.pop()
        return canvas
    }

    const drawComposer = compose(
        drawDebug,
        drawNN,
        setup
    )

    return () => {
        drawComposer(scene.canvas)
    }

}

export default draw