import agentUpdater from './updateAgent'

const update = function(scene) {

    const updateAgent = agentUpdater(scene)

    return () => {

        for(let  i = 0 ; i < scene.timeScale ; i++) {
            updateAgent()
        }
    }

}

export default update