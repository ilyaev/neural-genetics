import p5 from 'p5'
import * as Food from '../types/food'

const draw = function(scene) {

    const snakes = scene.snakes
    const config = scene.config
    const diet = scene.diet

    return () => {

        const canvas = scene.canvas

        snakes.filter(snake => snake.health > 0).forEach(snake => {

            const food = snake.food
            const snakeSelected = scene.selection.snake.id == snake.id

            if (!scene.ui.fantoms && !snakeSelected) {
                return
            }

            canvas.push()
                canvas.translate(snake.position.x, snake.position.y)
                canvas.fill(...config.colors.creature, 255)
                canvas.noStroke()
                if (snakeSelected) {
                    canvas.scale(1.4)
                    canvas.fill(...config.colors.selected, 255)
                }
                canvas.rect(...config.cellRectParams)
            canvas.pop()


            if (food && snakeSelected) {
                canvas.push()
                    canvas.stroke(255, 255, 255, 255 * Math.min(1, (1 - p5.Vector.dist(snake.position, food.position) / 200)))
                    canvas.line(snake.position.x, snake.position.y, food.position.x, food.position.y)
                canvas.pop()
            }

            snake.tail.forEach(tail => {
                canvas.push()
                    canvas.noStroke()
                    canvas.translate(tail.position.x, tail.position.y)
                    canvas.fill(...config.colors.creature, 150)
                    if (snakeSelected) {
                        canvas.fill(...config.colors.selected, 255)
                    }
                    canvas.rect(...config.cellRectParams)
                canvas.pop()
            })
            

        })
        
    }    

}

export default draw