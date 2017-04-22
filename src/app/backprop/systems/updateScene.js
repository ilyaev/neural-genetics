import { setNetInputValues, calculateNetOutput, sigmoid, adjustNetWeights } from '../types/neural'

const update = function(scene) {

    return () => {

        for(let  i = 0 ; i < scene.timeScale ; i++) {
            
            let e = 0
            const res = []

            scene.batch.forEach((input, index) => {
                const goal = scene.goals[index]
                setNetInputValues(scene.net, input)
                const output = calculateNetOutput(scene.net)[0].value

                const fPrime = sigmoid(output, true)
                const globalError = fPrime * (goal - output)
                e += Math.abs(goal - output)
                adjustNetWeights(scene.net, globalError)
                res.push([input, output, goal])

            })

            scene.epoch += 1

            if (scene.epoch % 100 == 0) {
                console.log(e, scene.epoch)
                res.forEach(row => {
                    console.log(row[0], row[1], row[2])
                })
            }

        }
    }

}

export default update