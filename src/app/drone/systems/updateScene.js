import shipsUpdater from './updateShips'
import genetics from './genetics'
import { updatePhysics } from '../scene'

const update = function(scene) {

    const updateShips = shipsUpdater(scene)
    const geneticUpdater = genetics(scene)()

    return () => {

        for(let  i = 0 ; i < scene.timeScale ; i++) {
            updatePhysics()
            updateShips()
            geneticUpdater.simulate()
        }
    }

}

export default update