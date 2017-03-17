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

            canvas.push()
                canvas.translate(snake.position.x, snake.position.y)
                canvas.fill(...config.colors.creature)
                canvas.noStroke()
                canvas.rect(...config.cellRectParams)
            canvas.pop()


            if (food) {
                canvas.stroke(255, 255, 255, 255 * Math.min(1, (1 - p5.Vector.dist(snake.position, food.position) / 200)))
                canvas.line(snake.position.x, snake.position.y, food.position.x, food.position.y)
            }

            snake.tail.forEach(tail => {
                canvas.push()
                    canvas.translate(tail.position.x, tail.position.y)
                    canvas.fill(...config.colors.creature, 125)
                    canvas.rect(...config.cellRectParams)
                canvas.pop()
            })
            

        })
        
    }    

}

export default draw