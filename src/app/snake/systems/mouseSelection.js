import { nearestSnake } from '../types/snake'

const mouseSelection = (scene) => {

    const pointSelect = (position) => {

        scene.snakes.forEach(creature => creature.selected = false)
        scene.selection.snake = false

        const nearest = nearestSnake(scene.snakes, position)

        nearest.selected = true
        scene.selection.snake = nearest
        
    }

    return () => ({
        pointSelect
    })

}

export default mouseSelection