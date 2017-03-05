import p5 from 'p5'
import { Food } from '../types/food'


const draw = function(p, food) {

    p.fill(255, 0, 0)
    food.forEach(one => {
        p.push()
            p.translate(one.position.x, one.position.y)
            p.ellipse(0, 0, one.size * 2, one.size * 2)
        p.pop()
    })

}

export default draw