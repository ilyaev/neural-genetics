import p5 from 'p5'
import compose from '../../lib/compose'
import drawNeuralNet from '../../systems/drawNeuralNet'
import drawGenetics from './drawGenetics'

import shipDrawer from './drawShips'
import targetDrawer from './drawTarget'
import boundaryDrawer from './drawBoundaries'

const draw = function(scene) {
    
    const drawShips = shipDrawer(scene)
    const drawBoundaries = boundaryDrawer(scene)
    const drawTarget = targetDrawer(scene)

    const setup = (canvas) => {
        canvas.background(0)
        return canvas
    }

    const drawGenPanel = (canvas) => {
        drawGenetics(scene.genCanvas, scene)
        scene.canvas.image(scene.genCanvas, 0, scene.canvas.height - scene.genCanvas.height)
        return canvas
    }

    const drawCurrentState = (canvas) => {
        drawShips()
        drawBoundaries()
        drawTarget()
        return canvas
    }

    const drawShipSelection = (canvas) => {
        if (scene.selection.ship) {
            drawNeuralNet(scene.selection.ship.net, '', scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, scene.config.width, 0)
        }
        return canvas
    }

    const drawComposer = compose(
        drawShipSelection,
        drawGenPanel,
        drawCurrentState,
        setup
    )

    return () => {
        drawComposer(scene.canvas)
    }

}

export default draw