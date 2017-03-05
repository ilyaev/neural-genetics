import p5 from 'p5'
import { Creature } from '../types/creature'


const drawPopulation = function(p, population) {

    p.fill(255, 255, 255)

    population.forEach(one => {

        const heading = one.velocity.heading()        

        p.push()
            p.stroke(255,255,255)
            p.translate(one.position.x, one.position.y)
            p.rotate(heading)
            p.ellipse(0, 0, one.size * 2, one.size * 2)
            p.line(0,0, one.size + 20, 0)
        p.pop()
        
    })

}

export default drawPopulation