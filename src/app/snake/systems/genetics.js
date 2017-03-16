import * as Snake from '../types/snake'
import compose from '../../lib/compose'
import p5 from 'p5'
import NeuralNet, { serializeNet, populateNet } from '../../types/neural'
import doCrossover from '../../lib/crossover'
import { replace as ReplaceArray } from '../../lib/array'


const simulation = (scene) => {

    var counter = -1
    var age = 0
    var lifespan = scene.config.simulation.lifespan

    const getElite = () => {
        let maxFitness = 0
        let sumFitness = 0

        const elite = scene.snakes
            .map(one => {
                if (one.fitness > maxFitness) {
                    maxFitness = one.fitness
                }
                sumFitness += one.fitness
                return one
            })
            .sort((a,b) => a.fitness > b.fitness ? -1 : 1)
            .slice(0, scene.snakes.length * 0.1 )
            .map((one,index) => {
                one.id = index + 1
                one.elitecount += 1
                one.category = 'elite ' + (one.elitecount > 1 ? (' +' + one.elitecount ) : '') 
                one.position = new p5.Vector(scene.config.center.x, scene.config.center.y)
                one.velocity = new p5.Vector(0,0)
                one.destination = new p5.Vector(scene.config.center.x, scene.config.center.y)
                one.generation += 1
                one.score = 0
                one.tail = []
                one.length = 0
                one.health = 100
                one.selected = false
                one.food = false
                one.dx = 0
                one.dy = 0
                return one
            })
        return [elite, maxFitness, sumFitness / scene.snakes.length]
    }

    const makeNewSnake = (population) => {
        const snake = Snake.createSnake(scene.config.center.x, scene.config.center.y)
        Snake.identifySnake(snake, population)
        return snake
    }

    const resupplyWithRandom = (population) => {
        while(population.length < scene.config.snakescount) {
            const creature = makeNewSnake(population)
            creature.category = 'random'
            population.push(creature)
        }
    }

    var getRandomNumber = function(range) {
        return Math.round(Math.random()*range)
    }

    const getNextParent = (maxFitness, firstParent = -1) => {
        const testFitness = getRandomNumber(maxFitness)
        let flag = true
        let counter = 0
        let parent = false
        let result = false
        let index = -1

        while(flag && counter < 1000) {
            index = getRandomNumber(scene.snakes.length - 1)
            if (index != firstParent) {
                parent = scene.snakes[index]
                if (parent.fitness >= testFitness) {
                    flag = false
                }
            }
            counter += 1
        }

        return [index, parent]
        
    }

    const crossover = (population, maxFitness) => {

        while(population.length < scene.snakes.length * 0.9) {
            
            let [indexMale, parentMale] = getNextParent(maxFitness)
            let [indexFemale, parentFemale] = getNextParent(maxFitness, indexMale)

            if (parentMale && parentFemale) {
            
                let mDNA = serializeNet(parentMale.net)
                let fDNA = serializeNet(parentFemale.net)

                doCrossover(mDNA, fDNA, scene.simulation).forEach(offspringDNA => {
                    const offspring = makeNewSnake(population)
                    offspring.category = 'D: ' + parentMale.fitness + ' / ' + parentFemale.fitness
                    populateNet(offspring.net, offspringDNA)
                    population.push(offspring)
                })

            }
        }
    }

    const newGeneration = () => {
        age = 0

        Snake.calculateFitness(scene.snakes)

        const [snakes, maxFitness, meanFitness] = getElite()

        scene.simulation.last.maxFitness = maxFitness
        scene.simulation.last.meanFitness = meanFitness
        scene.simulation.last.generation = scene.simulation.generation

        crossover(snakes, maxFitness)
        resupplyWithRandom(snakes)

        ReplaceArray(scene.snakes, snakes)

        scene.simulation.generation++

        scene.simulation.stats.push(Object.assign({}, scene.simulation.last))
    }

    const checkCounter = () => {
        counter++
        age++
        scene.simulation.last.age = age
        scene.simulation.last.lifespan = lifespan
        if (counter < 30) {
            return false
        }
        counter = 0
        return true
    }

    const simulate = () => {
        if (!checkCounter()) {
            return
        }
        
        const aliveCount = scene.snakes.filter(creature => creature.health > 0 ? true : false).length

        if (aliveCount > 0 && age < lifespan ) {
            return
        }

        newGeneration()

    }

    return () => (
        {
            simulate
        }
    )

}

export default simulation