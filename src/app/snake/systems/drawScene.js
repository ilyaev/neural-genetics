import p5 from 'p5'
import snakesDrawer from './drawSnakes'
import drawFood from './drawFood'
import drawNeuralNet from '../../systems/drawNeuralNet'
import drawGenetics from './drawGenetics'
import drawIdPanel from './drawIdPanel'
import compose from '../../lib/compose'


const draw = function(scene) {

    const drawSnakes = snakesDrawer(scene)

    const drawGenPanel = (canvas) => {
        drawGenetics(scene.genCanvas, scene)
        scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)
        return canvas
    }

    const setup = (canvas) => {
        canvas.background(0)
        canvas.noFill()
        canvas.stroke(200)
        canvas.rect(0, 0, scene.config.width, scene.config.height)
        return canvas
    }

    const drawSnakeSelection = (canvas) => {
        if (scene.selection.snake) {
            let genSelection = false
            if (scene.selection.genetics && scene.simulation.stats[scene.selection.generation]) {
                genSelection = scene.simulation.stats[scene.selection.generation].winner
            }
            drawNeuralNet(genSelection ? genSelection.net : scene.selection.snake.net, '', scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, scene.config.width, 0)

            drawIdPanel(scene.idCanvas, scene)
            scene.canvas.image(scene.idCanvas, scene.config.width, scene.nnCanvas.height)
        }
        return canvas
    }

    const drawGeneticSelection = (canvas) => {
        if (scene.selection.genetics && scene.simulation.stats.length > 1) {
            
            const rect = scene.genCanvas.chartRect
            const x = Math.round(scene.selection.generation * rect.interval)
            const generation = scene.selection.generation

            if (scene.simulation.stats[generation]) {
            
                canvas.line(
                    rect.x + x, 
                    canvas.height - 1, 
                    rect.x + x, 
                    canvas.height - scene.genCanvas.height + 1
                )

                const tSize = scene.genCanvas.height / 15

                canvas.textSize(tSize)
                canvas.text(scene.selection.generation, rect.x + x - tSize * 2, canvas.height - scene.genCanvas.height + tSize * 1.3)

                const snake = scene.simulation.stats[generation].winner
                drawSnakes(snake)
            }
        }
        return canvas
    }

    const drawCurrentState = (canvas) => {
        if (!scene.selection.genetics || scene.simulation.stats.length < 1) {
            drawSnakes()
            drawFood(canvas, scene.diet, scene)
        } else if (scene.genCanvas) {
            canvas.push()
                canvas.fill(255, 255, 255, 20)
                canvas.rect(1, scene.canvas.height - scene.genCanvas.height + 1, scene.genCanvas.width - 1, scene.genCanvas.height - 1)
            canvas.pop()
        }
        return canvas
    }

    return () => {

        compose(
            drawCurrentState,
            drawGeneticSelection,
            drawGenPanel,
            drawSnakeSelection,
            setup
        )(scene.canvas)
        
    }    

}

export default draw