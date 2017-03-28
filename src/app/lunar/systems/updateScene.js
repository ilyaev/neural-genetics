import shipsUpdater from './updateShips'

const update = function(scene) {

    const updateShips = shipsUpdater(scene)

    return () => {

        for(let  i = 0 ; i < scene.timeScale ; i++) {
            
            updateShips()

        }
    }

}

export default update