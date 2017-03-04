import p5 from 'p5'
import p5dom from 'p5/lib/addons/p5.dom'
import { NeuralNet, createNet, createSeekerNet, createNetFromDNA, createSeekerNetFromDNA } from './neural'
import { crossover } from './crossover'
import _ from 'lodash'
import * as p5collision from '../lib/p5.collision2d'

var getRandomNumber = function(range) {
    return Math.round(Math.random()*range)
}

const sketch = function(p) {

    var population = []
    var popcount = 4
    var deadcount = 0
    var diet = []
    var dietcount = 50
    var lifespan = 3000
    var age = 0
    var generation = 0
    var screenWidth = 800//(screen.width - 5) / 1
    var screenHeight = 600//(screen.height - 5) / 1
    var surviveRatio = 0.95
    var isActive = true
    var spawnPlace = 'center'
    var showDebug = true
    
    var debugText = []

    var log = function(txt) {
        debugText.push(txt)
    }

    class Food {
        constructor(x,y) {
            this.position = p.createVector(x, y)
        }

        show() {
            p.push()
                p.translate(this.position.x, this.position.y)
                p.fill(255, 0, 0, 125)
                p.ellipse(0,0, 20, 20)
            p.pop()
        }

    }

    class Sensor {
        constructor(host, x = 0, y = 0) {
            this.position = p.createVector(x,y)
            this.target = false
            this.targetVector = false
            this.distToTarget = 1000
            this.host = host
            this.vector = false
        }

        updateTo(vector) {
            this.vector = vector
            this.position.x = this.host.position.x + vector.x
            this.position.y = this.host.position.y + vector.y
        }

        setTarget(target) {
            this.target = target
            if (this.target) {
                this.targetVector = p5.Vector.sub(this.target.position, this.position)
                this.distToTarget = this.targetVector.mag()
            } else {
                this.distToTarget = 1000
                this.targetVector = p.createVector(0,0)
            }
        }

        show() {
            if (!this.host || showDebug == false) {
                return
            }
            p.push()
                let linkWeight = 0
                if (this.target) {
                    

                    linkWeight = this.distToTarget / this.host.sensSeekRange
                    let sensStrength = 5 + 10 * linkWeight

                    p.stroke(0, 255, 255, Math.max(50, 255 * linkWeight))
                    p.fill(0, 255, 0, Math.max(50, 255 * linkWeight))

                    p.line(this.position.x, this.position.y, this.target.position.x, this.target.position.y)

                    if (this.host.activeSensor && this.host.activeSensor.position.x == this.position.x) {
                        p.fill(255, 0, 0, 255)
                    }

                    p.ellipse(this.position.x, this.position.y, sensStrength, sensStrength)

                    
                } else {
                    p.ellipse(this.position.x, this.position.y, 5, 5)
                }
                p.stroke(0, 255, 0, Math.max(50, 255 * linkWeight))
                p.strokeWeight(1)                
                p.line(this.host.position.x, this.host.position.y, this.position.x, this.position.y)     
            p.pop()
        }

    }



    class Head {

        constructor(x,y) {
            this.position = p.createVector(x, y)
            this.velocity = p.createVector()
            this.acceleration = p.createVector()
            this.health = 100
            this.score = 0
            this.age = 0
            this.size = 1
            this.target = false
            this.work = 0
            this.net = createSeekerNet(0)
            this.sensors = []
            this.sensSize = 100            
            this.sensSeekRange = 100
            this.activeSensor = false

            for(let i = 0 ; i < 7 ; i++) {
                this.sensors.push(new Sensor(this))
            }
        }

        

        updateSensors() {
            const heading = this.velocity.heading() + p.PI / 2
            let sensIndex = 0;
            let angleStep = p.PI / 6
            this.sensors[sensIndex++].updateTo(p.createVector(0, -this.sensSize).rotate(heading))
            for(let step = 1 ; step <= 3; step++) {
                this.sensors[sensIndex++].updateTo(p.createVector(0, -1).rotate(heading + (angleStep * step)).setMag(this.sensSize - (step * this.sensSize / 6)))
                this.sensors[sensIndex++].updateTo(p.createVector(0, -1).rotate(heading - (angleStep * step)).setMag(this.sensSize - (step * this.sensSize / 6)))
            }
        }

        show() {
            let size = this.fitness() * 0.5
            p.push()            
                p.translate(this.position.x, this.position.y)
                p.stroke(255, 0, 0, 125)
                p.fill(255, 255, 255, 125)
                p.ellipse(0, 0, size * 2, size * 2)                
            p.pop()

            this.sensors.forEach(sensor => sensor.show())

            if (this.health > 0) {
                p.push()
                    if (this.target) {
                        const len = Math.max(10, p5.Vector.sub(this.position, this.target.position).mag())
                        p.stroke(0, 255, 255, 255 * (1 - (len/100)))
                        p.strokeWeight(1)
                        p.line(this.position.x, this.position.y, this.target.position.x, this.target.position.y)
                    }
                p.pop()
            }
        }

        getClosestFood(posFrom = this.position, range = 100) {
            const closeRange = 20
            let maxI = -1
            let maxDist = 10000
            for(let i = 0 ; i < diet.length ; i++) {
                if (diet[i]) {
                    let fDist = p5.Vector.sub(diet[i].position, posFrom).mag()
                    if (posFrom.x == this.position.x && this.position.y == posFrom.y && fDist < closeRange) {
                        this.score += 1
                        diet[i] = false;
                    }
                    if (fDist < range && fDist < maxDist) {
                        maxDist = fDist
                        maxI = i
                    }
                }
            }
            return maxI >= 0 ? diet[maxI] : false
        }

        useSeekerBrain() {
            const input = [
                    //this.position.x,
                    //this.position.y
                ]
                .concat(this.sensors.map(sensor => {
                    if (sensor.target) {
                        return Math.pow(this.sensSeekRange - sensor.distToTarget, 2)
                    } else {
                        return 1000000 
                    }
                }))

            this.net.setInput(input)
            const instruction = this.net.calculate()

            log('INPPUT: ' + input.toString())

            //console.log(instruction)

            let maxIndex = 0
            let maxWeight = -1000
            let maxSign = 1
            let desired = false

            let sensors = instruction.slice(0, 7)

            sensors.forEach((weight, index) => {
                if (Math.abs(weight) > maxWeight) {
                    maxWeight = Math.abs(weight)
                    maxIndex = index
                    maxSign = weight > 0 ? 1 : -1
                }
            })

            //console.log('maxw - ', maxWeight, maxSign, maxIndex)

            //console.log(sensors, maxWeight, maxIndex) 

            desired = p5.Vector.sub(this.sensors[maxIndex].position, this.position)

            desired.normalize()
            desired.mult(3.5)

            const steer = p5.Vector.sub(desired, this.velocity)
            steer.limit(0.05)

            this.acceleration = steer
            this.activeSensor = this.sensors[maxIndex]

        }

        useBrain() {
             this.net.setInput([
                this.position.x,
                this.position.y,
                food ? Math.pow( 1 - 100 / (food.position.x - this.position.x), 4) : 0.0,
                food ? Math.pow( 1 - 100 / (food.position.y - this.position.y), 4) : 0.0
            ])
            const instruction = this.net.calculate()
            this.acceleration = p.createVector(instruction[0], instruction[1]).setMag(0.05)
            this.work += Math.abs(this.acceleration.x) + Math.abs(this.acceleration.y)
        }

        seekFood() {
            
            let desired = false
            let minDist = 1000

            if (this.target) {
                desired = p5.Vector.sub(this.target.position, this.position)
                minDist = desired.mag()
            }
            
            
            let sensorFood = false
            this.sensors.forEach(sensor => {
                if (sensor.target) {
                    if (sensor.distToTarget < minDist) {
                        minDist = sensor.distToTarget
                        sensorFood = sensor
                    }
                }
            })

            if (sensorFood) {
                desired = p5.Vector.sub(sensorFood.position, this.position)
            }

            if (!desired) {
                return false
            }

            desired.normalize()
            desired.mult(3.5) // maxspeed

            const steer = p5.Vector.sub(desired, this.velocity)
            steer.limit(0.05)

            this.acceleration = steer

        }

        update() {
            const food = this.getClosestFood(this.position, this.sensSeekRange / 2)

            this.target = food

            this.sensors.forEach(sensor => {
                sensor.setTarget(this.getClosestFood(sensor.position, this.sensSeekRange))
            })

            if (this.health > 0) {

                this.useSeekerBrain()
                //this.seekFood()
                
                this.velocity.add(this.acceleration)
                this.collision()
                this.position.add(this.velocity)
                this.updateSensors()
                this.age += 1
            }
        }

        collision() {
            
            let nextX = this.position.x + this.velocity.x
            let nextY = this.position.y + this.velocity.y

            if (nextX > p.width) {
                this.position.x = 0
            }

            if (nextX < 0) {
                this.position.x = p.width
            }

            if (nextY > p.height) {
                this.position.y = 0
            }

            if (nextY < 0) {
                this.position.y = p.height
            }

        }

        kill() {
            this.health = 0
        }

        fitness() {
            return Math.max(5, this.score * 5)
        }

        getDNA() {
            return this.net.serialize()
        }
    }


    var createEntity = function(net = false) {
        let res = null
        if (spawnPlace == 'center') {
            res = new Head(p.width / 2, p.height / 2)
        } else {
            res = new Head(Math.random() * p.width, Math.random() * p.height)
        }
        if (net) {
            res.net = net
        }
        return res
    }

    var repopulate = function() {
        for(let i = 0 ; i < popcount ; i++) {
            if (population[i].health == 0 && population[i].age < 250) {
                //population[i] = createEntity()
                return
            }
        }
        for(let i = 0 ; i < dietcount ; i++) {
            if (!diet[i]) {
                diet[i] = new Food(Math.random() * screenWidth, Math.random() * screenHeight)
            }
        }
    }

    var getNextParent = function(maxFitness, firstParent = -1) {
        const testFitness = getRandomNumber(maxFitness)
        let flag = true
        let counter = 0
        let parent = false
        let result = false
        let index = -1

        while(flag && counter < 1000) {
            index = getRandomNumber(population.length - 1)
            if (index != firstParent) {
                parent = population[index]
                if (parent.fitness() >= testFitness) {
                    flag = false
                }
            }
            counter += 1
        }

        return [index, parent]
        
    }

    var crossOver = function() {

        let maxFitness = 0
        let meanFitness = 0
        let allFitness = 0

        population.forEach(creature => {
            let fitness = creature.fitness()
            if (fitness > maxFitness) {
                maxFitness = fitness
            }
            allFitness += fitness
        })
        meanFitness = allFitness / population.length

        console.log('fitness - ', maxFitness, Math.round(meanFitness))

        let elite = population.sort((a,b) => a.fitness() > b.fitness() ? -1 : 1).slice(0, popcount / 10)
        let species = elite
        let flag = true

        while((species.length < population.length * 0.9) && flag) {
            let [indexMale, parentMale] = getNextParent(maxFitness)
            let [indexFemale, parentFemale] = getNextParent(maxFitness, indexMale)
            if (parentMale && parentFemale) {
                let mDNA = parentMale.getDNA()
                let fDNA = parentFemale.getDNA()
                let childs = crossover(mDNA, fDNA)
                species.push(createEntity(createSeekerNetFromDNA(childs[0])))
                species.push(createEntity(createSeekerNetFromDNA(childs[1])))
            } else {
                flag = false
            }
        }

        while(species.length < population.length) {
            species.push(createEntity())
        }

        population = species

        population.forEach(creature => {
            creature.position = p.createVector(p.width / 2, p.height / 2)
            creature.velocity = p.createVector()
            creature.health = 100
            creature.age = 0
            creature.score = 0
            creature.work = 0
        })
    }

    var newGeneration = function() {
        
        if (generation > 0) {
            crossOver()
        } else {
            for(let i = 0 ; i < popcount ; i++) {
                population.push(createEntity())
            }
        }

        for(let i = 0 ; i < dietcount ; i++) {
            diet[i] = new Food(Math.random() * screenWidth, Math.random() * screenHeight)
        }
        
        
        age = 0
        deadcount = 0
        generation += 1
    }

    var debugConsole = false

    p.setup = function() {
        p.createCanvas(screenWidth, screenHeight)
        debugConsole = p.createElement('div', 'Debug Console')
        debugConsole.position(screenWidth + 10, 0)
        newGeneration()                
    }

    p.keyPressed = function() {
        isActive = !isActive
    }

    p.draw = function() {
        debugText = []
        if (age > lifespan || deadcount > Math.round(popcount * surviveRatio)) {
            newGeneration()
        }

        p.background('black') 

        population.forEach(creature => {
            creature.show()
            isActive && creature.update()
        })

        diet.forEach(one => one && one.show())

        repopulate()
        age += 1
        debugConsole.html(debugText.join('<br>'))
    }

    p.mouseClicked = function() {
        console.log(p.dist)
        diet.forEach(one => {
            if (p.collidePointCircle(p.mouseX, p.mouseY, one.position.x, one.position.y, 20, p.dist)) {
                console.log(one)
            }
        })
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