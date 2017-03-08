import { neighboursCreatures, nearestCreature } from '../types/creature'

const mouseSelection = (scene) => {

    const pointSelect = (position) => {

        scene.population.forEach(creature => creature.selected = false)
        scene.selection.creature = false

        const nearest = nearestCreature(scene.population, position)

        nearest.selected = true
        scene.selection.creature = nearest
        
    }

    return () => ({
        pointSelect
    })

}

export default mouseSelection