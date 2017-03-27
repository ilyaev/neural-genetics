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
    x = Math.round(x / config.cellSize) * config.cellSize
    y = Math.round(y / config.cellSize) * config.cellSize
    const food = Food(new p5.Vector(x,y))
    food.snakeId = snakeId
    diet.push(food)
}

export const relocate = (food) => {
    food.position.x = Math.round(Math.random() * (config.cWidth - 2)) + 1
    food.position.x *= config.cellSize 
    
    food.position.y = Math.round(Math.random() * (config.cHeight - 2)) + 1
    food.position.y *= config.cellSize

    food.active = true
}