import p5 from 'p5'
import compose from '../../lib/compose'
import { getState } from '../scene'
import { genStateTag } from '../types/state'

const draw = function(scene) {

    const config = scene.config
    const agent = scene.agent

    const setup = (canvas) => {
        canvas.background(125)
        return canvas
    }

    const drawCell = function(canvas, x, y) {
        const nX = x * config.cellSize
        const nY = y * config.cellSize

        canvas.push()

        const state = getState(genStateTag(x, y))
        const maxAction = state.actions.reduce((next, result) => {
            return next.reward > result.reward ? next : result
        }, state.actions[0])
        const minAction = state.actions.reduce((next, result) => {
            return next.reward < result.reward ? next : result
        }, state.actions[0])

        canvas.fill(255)
        canvas.rect(nX, nY, config.cellSize, config.cellSize)

        if (Math.abs(state.reward) > 0.1) {

            if (state.reward > 0) {
                canvas.fill(0, 200, 0, 255 * state.reward)
            } else {
                canvas.fill(200, 0, 0, 255 * Math.abs(state.reward))
            }

        }

        canvas.rect(nX, nY, config.cellSize, config.cellSize)

        canvas.fill(0)
        canvas.text(maxAction.reward.toFixed(2), nX + 10, nY + 30)

        if (Math.abs(state.reward) != 1) {
            let dir = 0
            if (maxAction.tag == 'down') {
                dir = Math.PI
            } else if (maxAction.tag == 'left') {
                dir = -Math.PI / 2
            } else if (maxAction.tag == 'right') {
                dir = Math.PI / 2
            }

            canvas.translate(nX + config.cellSize / 2, nY + config.cellSize / 2)
            canvas.rotate(dir)
            canvas.fill(0, 200, 0, 255 * maxAction.reward)
            canvas.beginShape(canvas.TRIANGLES)
                canvas.vertex(0, -20)
                canvas.vertex(20, 20)
                canvas.vertex(-20, 20)
            canvas.endShape()
        }


        canvas.pop()
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
            const nX = agent.x * config.cellSize
            const nY = agent.y * config.cellSize
            canvas.rect(nX, nY, config.cellSize, config.cellSize)
        canvas.pop()
        return canvas
    }

    const drawDebug = function(canvas) {
        canvas.text("FPS: " + canvas.frameRate().toFixed(2), 10, 60);
        return canvas
    }

    const drawComposer = compose(
        drawDebug,
        //drawAgent,
        drawGrid,
        setup
    )

    return () => {
        drawComposer(scene.canvas)
    }

}

export default draw