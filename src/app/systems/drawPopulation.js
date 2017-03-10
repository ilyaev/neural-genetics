import p5 from 'p5'
import { Creature } from '../types/creature'


const drawPopulation = function(p, population) {

    p.push()

    p.fill(255, 255, 255)
    p.stroke(255,255,255)

    let pColor = {
        normal: [255, 255, 255],
        selected: [0, 255, 0],
        boost: [0, 0, 255]
    }

    population.forEach(one => {

        const heading = one.velocity.heading()        

        p.push()
            p.translate(one.position.x, one.position.y)
            p.rotate(heading)
            
            const size = (one.size + one.score) * 2
            const healthAlpha = Math.min((one.health / 300) * 255, 255)

            if (one.selected) {
                p.fill(0, 125, 0)
                p.ellipse(0, 0, size * 1.5, size * 1.5)
                p.fill(...pColor.selected, healthAlpha)
            } else {
                if (one.speed > 1) {
                    p.fill(...pColor.boost, healthAlpha)
                } else {
                    p.fill(...pColor.normal, healthAlpha)
                }
            }

            p.ellipse(0, 0, size, size)
            if (one.health > 0) {
                p.line(0,0, one.size + 20, 0)
            }
        p.pop()

        if (one.selected) {
            p.push()
            if (one.targetCreature) {
                p.stroke(255, 255, 255)
                p.line(one.position.x, one.position.y, one.targetCreature.position.x, one.targetCreature.position.y)
            }
            if (one.targetFood) {
                p.stroke(255, 0, 0)
                p.line(one.position.x, one.position.y, one.targetFood.position.x, one.targetFood.position.y)
            }
            p.pop()
        }
        
    })

    p.pop()

}

export default drawPopulation