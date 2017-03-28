import p5 from 'p5'
import compose from '../../lib/compose'
import drawNeuralNet from '../../systems/drawNeuralNet'

import shipDrawer from './drawShips'
import boundaryDrawer from './drawBoundaries'

const draw = function(scene) {
    
    const drawShips = shipDrawer(scene)
    const drawBoundaries = boundaryDrawer(scene)

    const setup = (canvas) => {
        canvas.background(0)
        return canvas
    }

    const drawCurrentState = (canvas) => {
        drawShips()
        drawBoundaries()
        return canvas
    }

    const drawShipSelection = (canvas) => {
        if (scene.selection.ship) {
            drawNeuralNet(scene.selection.ship.net, '', scene.nnCanvas)
            scene.canvas.image(scene.nnCanvas, scene.config.width, 0)
        }
    }

    const drawComposer = compose(
        drawShipSelection,
        drawCurrentState,
        setup
    )

    return () => {
        drawComposer(scene.canvas)
    }

}

export default draw