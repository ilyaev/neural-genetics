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

    const calculate = (net) => {
        Neural.calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const generateCommand = (snake) => {

        const desired = p5.Vector.sub(snake.position, snake.food.position).setMag(1)

        const input = [
            desired.x,
            desired.y
        ]

        let dx = 0
        let dy = 0

        Neural.setNetInputValues(snake.net, input)
        const output = calculate(snake.net)

        if (Math.abs(output[0]) > Math.abs(output[1])) {
            dx = output[0] > 0 ? 1 : -1
        } else {
            dy = output[1] > 0 ? 1 : -1
        }

        snake.dx = dx
        snake.dy = dy

        Snake.setDestination(snake.position.x + config.cellSize * snake.dx, snake.position.y + config.cellSize * snake.dy, snake)
        return snake
    }

    const move = (snake) => {
        [snake].concat(snake.tail).forEach(body => body.position.add(body.velocity))
        return snake
    }

    const collisionCheck = (snake) => {
        const {x, y} = snake.destination
        if (x >= maxX || x <= 0 || y >= maxY || y <= 0) {
            snake.health = 0
        }
        return snake
    }

    const assignFood = (snake) => {
        if (!snake.food) {
            snake.food = Food.getSnakeFood(diet, snake.id)
        }
    }

    return () => {

        snakes
            .filter(aliveSnakesFilter)
            .map(move)
            .filter(finishedMoveFilter)
            .map(compose(
                assignFood,
                collisionCheck, 
                generateCommand
            ))
    }

}

export default update