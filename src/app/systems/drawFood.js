import p5 from 'p5'
import { Food } from '../types/food'


const draw = function(p, food) {

    p.push()
        p.fill(255, 0, 0)
        p.noStroke()
        food.filter(one => !one.eaten).forEach(one => {
            p.push()
                p.translate(one.position.x, one.position.y)
                p.ellipse(0, 0, one.size * 2, one.size * 2)
            p.pop()
        })
    p.pop()

}

export default draw