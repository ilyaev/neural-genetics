import p5 from 'p5'
import compose from '../../lib/compose'

const draw = function(scene) {

    const config = scene.config
    const agent = scene.agent

    const setup = (canvas) => {
        canvas.background(125)
        return canvas
    }

    const drawCell = function(canvas, x, y) {
        canvas.rect(x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize)
    }

    const drawGrid = function(canvas) {
        canvas.push()
            canvas.fill(255)
            scene.cells.forEach(cell => drawCell(canvas, cell.x, cell.y))
        canvas.pop()
        return canvas
    }

    const drawAgent = function(canvas) {
        canvas.push()
            canvas.fill(0, 150, 0)
            drawCell(canvas, agent.x, agent.y)
        canvas.pop()
        return canvas
    }

    const drawComposer = compose(
        drawAgent,
        drawGrid,
        setup
    )

    return () => {
        drawComposer(scene.canvas)
    }

}

export default draw