import p5 from 'p5'
import { Food } from '../types/food'
import config from '../config'

const drawOne = (p, one) => {
    p.push()
        p.translate(one.position.x, one.position.y)
        p.ellipse(0, 0, config.cellSize, config.cellSize)
    p.pop()
}

const draw = function(p, food, scene) {

    p.push()
        p.fill(255, 0, 0, 125)
        p.noStroke()

        if (!scene.ui.fantoms && scene.selection.snake) {
            if (scene.selection.snake.food) {
                drawOne(p, scene.selection.snake.food)
            }
        }  else {
            food.filter(one => one.active == true).forEach(one => {
                drawOne(p, one)
            })
        }
    p.pop()

}

export default draw