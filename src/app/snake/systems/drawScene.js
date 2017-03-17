import p5 from 'p5'
import snakesDrawer from './drawSnakes'
import drawFood from './drawFood'
import drawNeuralNet from '../../systems/drawNeuralNet'
import drawGenetics from './drawGenetics'



const draw = function(scene) {

    const drawSnakes = snakesDrawer(scene)

    return () => {

        const canvas = scene.canvas

        canvas.background(0)
        canvas.noFill()
        canvas.stroke(200)
        canvas.rect(0, 0, scene.config.width, scene.config.height)

        drawSnakes()
        drawFood(canvas, scene.diet)

        drawNeuralNet(scene.snakes[0].net, 'ID: ' + scene.snakes[0].id, scene.nnCanvas)
        scene.canvas.image(scene.nnCanvas, scene.config.width, 0)

        drawGenetics(scene.genCanvas, scene)
        scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)
    }    

}

export default draw