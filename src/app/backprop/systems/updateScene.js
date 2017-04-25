import { train, setNetInputValues, calculateNetOutput, sigmoid, adjustNetWeights, calculateErrors, backPropagateError, calculateGlobalError } from '../types/neural'

const update = function(scene) {

    const trainNet = () => {
        train(scene.net, scene.batch, scene.goals)
    }

    return () => {
        if (scene.calculated) {
            return
        }

        trainNet()

    }

}

export default update