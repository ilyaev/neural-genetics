import p5 from 'p5'
import config from '../config'

export const Food = (position = null, size = config.cellSize / 2) => {

    return {
        position,
        size,
        eaten: false,
        snakeId: -1,
        active: true
    }

}

export const getSnakeFood = (diet, snakeId) => {
    return diet.reduce((result, next) => next.snakeId == snakeId ? next : result, false)
}

export const spawnFood = (diet, x, y, snakeId) => {
    const food = Food(new p5.Vector(x,y))
    food.snakeId = snakeId
    diet.push(food)
}