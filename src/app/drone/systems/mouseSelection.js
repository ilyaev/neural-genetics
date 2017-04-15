import { nearestShip } from '../types/ship'

const mouseSelection = (scene) => {

    const pointSelect = (position) => {
        const selected = nearestShip(scene.ships, position)
        scene.selection.ship = selected
        console.log('Selected Ship #' + (selected ? selected.id : 'NoNE'))
    }

    return () => ({
        pointSelect
    })

}

export default mouseSelection