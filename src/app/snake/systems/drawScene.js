import p5 from 'p5'
import snakesDrawer from './drawSnakes'
import drawFood from './drawFood'
import drawNeuralNet from '../../systems/drawNeuralNet'
import drawGenetics from './drawGenetics'
import drawIdPanel from './drawIdPanel'



const draw = function(scene) {

    const drawSnakes = snakesDrawer(scene)

    return () => {

        const canvas = scene.canvas

        canvas.background(0)
        canvas.noFill()
        canvas.stroke(200)
        canvas.rect(0, 0, scene.config.width, scene.config.height)

        drawSnakes()
        drawFood(canvas, scene.diet, scene)

        if (scene.selection.snake) {
            drawNeuralNet(scene.selection.snake.net, '', scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, scene.config.width, 0)

            drawIdPanel(scene.idCanvas, scene)
            scene.canvas.image(scene.idCanvas, scene.config.width, scene.nnCanvas.height)
        }

        drawGenetics(scene.genCanvas, scene)
        scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)

        if (scene.selection.genetics) {
            canvas.ellipse(canvas.mouseX, canvas.mouseY, 10,10)
        }

        
    }    

}

export default draw