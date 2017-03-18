import p5 from 'p5'
import * as Snake from '../types/snake'
import * as Food from '../types/food'
import * as Neural from '../../types/neural'
import compose from '../../lib/compose'

const finishedMoveFilter = (snake) => p5.Vector.dist(snake.position, snake.destination) < 0.01 ? true : false
const aliveSnakesFilter = (snake) => snake.health > 0 ? true : false

const update = function(scene) {

    const snakes = scene.snakes
    const diet = scene.diet
    const config = scene.config
    const maxX = config.width
    const maxY = config.height
    const cellSize = config.cellSize
    const halfCellSize = cellSize / 2
    const cWidth = Math.round(maxX / cellSize)
    const cHeight = Math.round(maxY / cellSize)

    const calculate = (net) => {
        Neural.calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const validateCommand = (dx, dy, snake) => {
        const cellX = Math.round(snake.position.x / cellSize) + dx
        const cellY = Math.round(snake.position.y / cellSize) + dy
        if (cellX < 0 || cellX > cWidth || cellY < 0 || cellY > cHeight) {
            return false
        }
        let result = true
        snake.tail.forEach(tail => {
            if (result) {
                const tX = Math.round(tail.position.x / cellSize)
                const tY = Math.round(tail.position.y / cellSize)
                if (tX == cellX && tY == cellY) {
                    result = false
                }
            }
        })
        return result
    }

    const getNeighboursVector = (snake) => {
        const coords = [[-1,0],[1,0],[0,-1],[0,1]].map(pair => {
            const tX = Math.round(snake.position.x / cellSize) + pair[0]
            const tY = Math.round(snake.position.y / cellSize) + pair[1]
            return [tX, tY]
        })

        let result = [1,1,1,1]

        snake.tail.forEach(tail => {
            const tX = Math.round(tail.position.x / cellSize)
            const tY = Math.round(tail.position.y / cellSize)
            coords.forEach((pair, index) => {
                if (pair[0] == tX && pair[1] == tY) {
                    result[index] = -1
                } else if (tX < 0 || tX > cWidth || tY < 0 || tY > cHeight) {
                    result[index] = -1
                }
            })
        })

        return result
        
    }

    const generateCommand = (snake) => {

        const desired = p5.Vector.sub(snake.position, snake.food.position).setMag(1)
        const nV = getNeighboursVector(snake)
        const input = [
            desired.x,
            desired.y,
            snake.dx,
            snake.dy,
            // scene.canvas.map(snake.position.x, 0, maxX, -1, 1),
            // scene.canvas.map(snake.position.y, 0, maxY, -1, 1)
            // snake.position.x < 100 ? snake.position.x / 100 : 0,
            // snake.position.y < 100 ? snake.position.y / 100 : 0,
            // snake.position.x > (maxX - 100) ? 1 - (maxX - snake.position.x) / 100 : 0,
            // snake.position.y > (maxY - 100) ? 1 - (maxY - snake.position.y) / 100 : 0,
            //snake.tail.length / 100 * 2 - 1
        ].concat(nV)

        let dx = 0
        let dy = 0

        Neural.setNetInputValues(snake.net, input)
        const output = calculate(snake.net)

        if (Math.abs(output[0]) > Math.abs(output[1])) {
            dx = output[0] > 0 ? 1 : -1
        } else {
            dy = output[1] > 0 ? 1 : -1
        }
        if (validateCommand(dx, dy, snake)) {
            snake.dx = dx
            snake.dy = dy
        }

        Snake.setDestination(snake.position.x + config.cellSize * snake.dx, snake.position.y + config.cellSize * snake.dy, snake)
        return snake
    }

    const move = (snake) => {
        [snake].concat(snake.tail).forEach(body => body.position.add(body.velocity))
        return snake
    }

    const collisionCheck = (snake) => {
        const {x, y} = snake.destination
        const cellX = Math.round(x / cellSize)
        const cellY = Math.round(y / cellSize)

        let result = true
        snake.tail.forEach(tail => {
            if (result) {
                const tX = Math.round(tail.position.x / cellSize)
                const tY = Math.round(tail.position.y / cellSize)
                if (tX == cellX && tY == cellY) {
                    result = false
                }
            }
        })

        if (!result || x >= maxX || x <= 0 || y >= maxY || y <= 0) {
            snake.health = 0
            snake.food.active = false
        }


        return snake
    }

    const assignFood = (snake) => {
        if (!snake.food) {
            snake.food = Food.getSnakeFood(diet, snake.id)
        }
        return snake
    }

    const foodFoundCheck = (snake) => {
        if (!snake.food) {
            return
        }
        if (p5.Vector.dist(snake.position, snake.food.position) < cellSize) {
            Snake.grow(snake)
            snake.food.position.x = Math.random() * maxX
            snake.food.position.y = Math.random() * maxY
            snake.food.active = true
            snake.score += 1
        }
        return snake
    }

    return () => {

        snakes
            .filter(aliveSnakesFilter)
            .map(move)
            .filter(finishedMoveFilter)
            .map(compose(
                foodFoundCheck,
                assignFood,
                collisionCheck,
                generateCommand
            ))

        if (scene.selection.snake && scene.selection.snake.health <= 0) {
            scene.selection.snake.selected = false
            scene.selection.snake = Snake.fittestSnake(scene.snakes)
            scene.selection.snake.selected = true
        }
    }

}

export default update