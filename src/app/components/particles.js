import p5 from 'p5'

const sketch = function(p) {

    var entity = null
    var entities = []
    var vels = []
    var accels = []
    var eCount = 600

    var validate = function() {
        for(let i = 0 ; i < eCount ; i++) {
            const ent = entities[i]
            if (ent.x > p.width || ent.y > p.height || ent.x < 0 || ent.y < 0) {
                entities[i] = p.createVector(p.width / 2, p.height / 2)
                vels[i] = p.createVector(Math.random() - 0.5, Math.random() - 0.5)
                accels[i] = p.createVector((Math.random() -0.5 ) / 15, (Math.random() - 0.5) / 15)
            }
        }
    }

    p.setup = function() {
        p.createCanvas(640, 480)

        entity = p.createVector(100, 100)
        for(var i = 0 ; i < eCount ; i++) {
            entities.push(p.createVector(p.width / 2, p.height / 2))
            vels.push(p.createVector(Math.random() - 0.5, Math.random() - 0.5))
            accels.push(p.createVector((Math.random() -0.5 ) / 5, (Math.random() - 0.5) / 5))
        }

        p.background('black')
        p.strokeWeight(4)
    }

    p.draw = function() {
        p.background('black')
        p.stroke(255,255,255,125)
        for(let i = 0 ; i < eCount ; i++) {
            p.point(entities[i].x, entities[i].y)
            entities[i].add(vels[i])
            vels[i].add(accels[i])
        }
        validate()
    }    

}


export default class Render {
    constructor(element) {
        this.element = element
        this.myp5 = undefined
        this.setup()
        this.createGUI()
    }

    setup = () => {
        this.myp5 = new p5(sketch, this.element)
    }

    createGUI = () => {

    }


}