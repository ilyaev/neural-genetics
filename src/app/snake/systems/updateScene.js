import p5 from 'p5'
import snakesUpdater from './updateSnakes'
import genetics from './genetics'

const update = function(scene) {

    const updateSnakes = snakesUpdater(scene)
    const geneticUpdater = genetics(scene)()

    return () => {

        for(let  i = 0 ; i < scene.timeScale ; i++) {
            updateSnakes()
            geneticUpdater.simulate()
        }
    }

}

export default update