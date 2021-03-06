import p5 from 'p5'
import * as Snake from '../types/snake'
import * as Food from '../types/food'
import * as Neural from '../../types/neural'
import compose from '../../lib/compose'

const finishedMoveFilter = (snake) => p5.Vector.dist(snake.position, snake.destination) < 0.01 ? true : false
const aliveSnakesFilter = (snake) => snake.health > 0 ? true : false
const deadMove = (snake, dx, dy) => {

}

const update = function(scene) {

    const snakes = scene.snakes
    const diet = scene.diet
    const config = scene.config

    let inputs = false

    const calculate = (net) => {
        Neural.calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const validateCommand = (dx, dy, snake) => {
        const cellX = snake.cell.x + dx
        const cellY = snake.cell.y + dy

        if (cellX <= 0 || cellX > config.cWidth || cellY <= 0 || cellY > config.cHeight) {
            return false
        }
        let result = true
        snake.tail.forEach(tail => {
            if (result) {
                if (tail.cell.x == cellX && tail.cell.y == cellY) {
                    result = false
                }
            }
        })
        return result
    }

    const inputAroundVector = (snake) => {
        const coords = [[-1,0],[1,0],[0,-1],[0,1]].map(pair => 
            [snake.cell.x + pair[0], snake.cell.y + pair[1]]
        )

        let result = [1,1,1,1]

        snake.tail.forEach(tail => {
            const tX = tail.cell.x
            const tY = tail.cell.y
            coords.forEach((pair, index) => {
                if (pair[0] == tX && pair[1] == tY) {
                    result[index] = -1
                } else if (tX < 0 || tX > config.cWidth || tY < 0 || tY > config.cHeight) {
                    result[index] = -1
                }

                if (result[index] == 1) {
                    //for(int x = )
                }

            })
        })

        return result
        
    }

    const inputSnakeCenterVector = (snake) => {
        const result = [].concat([snake]).concat(snake.tail)
            .reduce((sum, next) => {
                sum.v.add(next.position)
                sum.c += 1
                return sum
            }, {v: new p5.Vector(0,0), c: 0})
       
       result.v.div(result.c)
       const desired = p5.Vector.sub(result.v, snake.position).setMag(1)

       return [
            desired.x,
            desired.y
        ]
    }

    const inputFoodVector = (snake) => {
        const desired = p5.Vector.sub(snake.position, snake.food.position).setMag(1)
        let distance = 0
        if (snake.food) {
            distance = Math.abs(snake.position.x - snake.food.position.x) + Math.abs(snake.position.y - snake.food.position.y)
            distance /= (config.width + config.height)
        }

        return [
            desired.x,
            desired.y,
            distance
        ]
    }

    const inputTailVector = (snake) => {
        if (!snake.tail.length) {
            return [0,0]
        }
        const desired = p5.Vector.sub(snake.position, snake.tail[snake.tail.length - 1].position).setMag(1)
        return [
            desired.x,
            desired.y
        ]
    }

    const inputSnakeVelocity = (snake) => {
        return [
            snake.dx,
            snake.dy
        ]
    }

    const inputSnakeSize = (snake) => {
        return [
            scene.canvas.map(snake.tail.length, 0, 20, -1, 1) * -1
        ]
    }

    const outputVector2 = (output) => {
        let dx = 0
        let dy = 0

        if (Math.abs(output[0]) > Math.abs(output[1])) {
            dx = output[0] > 0 ? 1 : -1
        } else {
            dy = output[1] > 0 ? 1 : -1
        }

        return [dx, dy]
    }

    const outputVector4 = (output) => {
        let signal = 0
        let maxVal = -100

        output.forEach((value, index) => {
            if (value > maxVal) {
                maxVal = value
                signal = index
            }
        })

        const signals = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ]

        const dx = signals[signal][0]
        const dy = signals[signal][1]

        return [dx, dy]
    }

    const customStrategy = (snake) => {
        let result = []
        
        Object.keys(config.inputSize).forEach((input, index) => {
            if (scene[input] && inputs[input]) {
                result = result.concat(inputs[input](snake))
            }
        })

        Neural.setNetInputValues(snake.net, result)
        const output = calculate(snake.net)

        return outputVector4(output.slice(0, 4)).concat([output.slice(-2)])
    }

    const generateCommand = (snake) => {

        const [dx, dy, output] = customStrategy(snake)

        if (validateCommand(dx, dy, snake)) {
            snake.dx = dx
            snake.dy = dy
        } else if (snake.tail.length > 0 && !validateCommand(snake.dx, snake.dy, snake)) {
            [snake.dx, snake.dy] = avoidObstacle(output[0], output[1], snake)
        }
        
        Snake.setDestination(snake.position.x + config.cellSize * snake.dx, snake.position.y + config.cellSize * snake.dy, snake)

        return snake
    }

    const avoidObstacle = (left, right, snake) => {
        let dx = 0
        let dy = 0

        if (snake.dy == 0) {
            dy = left > right ? 1 : -1
            if (!validateCommand(dx, dy, snake)) {
                dy *= -1
            }
        } else {
            dx = left > right ? 1 : -1
            if (!validateCommand(dx, dy, snake)) {
                dx *= -1
            }
        }

        return [dx, dy]
    }

    const move = (snake) => {
        [snake].concat(snake.tail).forEach(body => {
            body.position.add(body.velocity)
            body.cell.x = Snake.pixel2cell(body.position.x)
            body.cell.y = Snake.pixel2cell(body.position.y)
        })
        return snake
    }

    const collisionCheck = (snake) => {
        const {x, y} = snake.destination
        const tailHit = snake.tail.reduce((result, tail) => {
            return result ? result : (tail.cell.x == snake.destCell.x && tail.cell.y == snake.destCell.y)
        }, false)
        

        if (tailHit || x >= config.width || x <= 0 || y >= config.height || y <= 0) {
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
        if (p5.Vector.dist(snake.position, snake.food.position) < config.cellSize) {
            Snake.grow(snake)
            Food.relocate(snake.food)
            snake.score += 1
            snake.health = config.cWidth + config.cHeight + snake.score * 20
        }

        snake.health--
        if (snake.health <= 0) {
            snake.food.active = false
        }
        
        return snake
    }

    const updateSelection = () => {
        if (scene.selection.snake && scene.selection.snake.health <= 0) {
            scene.selection.snake.selected = false
            scene.selection.snake = Snake.fittestSnake(scene.snakes)
            scene.selection.snake.selected = true
        }
    }

    const initInputs = () => {
        if (!inputs)  {
            inputs = {
                iFoodV2: inputFoodVector,
                iSnakeCenterV2: inputSnakeCenterVector,
                iSnakeVelocityV2: inputSnakeVelocity,
                iSnakeAroundV4: inputAroundVector,
                iSnakeTailV2: inputTailVector,
            }
        }
    }

    return () => {

        initInputs()

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

        updateSelection()
        
    }
    

}

export default update