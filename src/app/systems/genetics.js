import * as Creature from '../types/creature'
import compose from '../lib/compose'
import p5 from 'p5'
import NeuralNet, { serializeNet, populateNet } from '../types/neural'
import doCrossover from '../lib/crossover'
import { replace as ReplaceArray } from '../lib/array'


const simulation = (scene) => {

    var counter = -1
    var age = 0
    var lifespan = scene.config.simulation.lifespan

    const getElite = () => {
        let maxFitness = 0
        let sumFitness = 0

        const elite = scene.population
            .map(one => {
                if (one.fitness > maxFitness) {
                    maxFitness = one.fitness
                }
                sumFitness += one.fitness
                return one
            })
            .sort((a,b) => a.fitness > b.fitness ? -1 : 1)
            .slice(0, scene.population.length * 0.1 )
            .map((one,index) => {
                one.id = index + 1
                one.elitecount += 1
                one.category = 'elite ' + (one.elitecount > 1 ? (' +' + one.elitecount ) : '') 
                Creature.resetCreature(one)
                one.position = new p5.Vector(scene.config.center.x, scene.config.center.y)
                one.generation += 1
                one.score = 0
                one.health = 300
                one.selected = false
                one.targetCreature = false
                one.targetFood = false
                return one
            })
        return [elite, maxFitness, sumFitness / scene.population.length]
    }

    const makeNewCreature = (population) => {
        const creature = Creature.makeCreature(scene.config.center.x, scene.config.center.y)
        Creature.identifyCreature(creature, population)
        creature.net = new NeuralNet()
        return creature
    }

    const resupplyWithRandom = (population) => {
        while(population.length < scene.config.popcount) {
            const creature = makeNewCreature(population)
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
            index = getRandomNumber(scene.population.length - 1)
            if (index != firstParent) {
                parent = scene.population[index]
                if (parent.fitness >= testFitness) {
                    flag = false
                }
            }
            counter += 1
        }

        return [index, parent]
        
    }

    const crossover = (population, maxFitness) => {

        while(population.length < scene.population.length * 0.9) {
            
            let [indexMale, parentMale] = getNextParent(maxFitness)
            let [indexFemale, parentFemale] = getNextParent(maxFitness, indexMale)

            if (parentMale && parentFemale) {
            
                let mDNA = serializeNet(parentMale.net)
                let fDNA = serializeNet(parentFemale.net)

                doCrossover(mDNA, fDNA, scene.simulation).forEach(offspringDNA => {
                    const offspring = makeNewCreature(population)
                    offspring.category = 'D: ' + parentMale.fitness + ' / ' + parentFemale.fitness
                    populateNet(offspring.net, offspringDNA)
                    population.push(offspring)
                })

            }
        }
    }

    const newGeneration = () => {
        age = 0

        Creature.calculateFitness(scene.population)

        const [population, maxFitness, meanFitness] = getElite()

        scene.simulation.last.maxFitness = maxFitness
        scene.simulation.last.meanFitness = meanFitness
        scene.simulation.last.generation = scene.simulation.generation

        crossover(population, maxFitness)
        resupplyWithRandom(population)

        compose(
            Creature.initializeVelocity,
            Creature.initializeAcceleration
        )(population)

        ReplaceArray(scene.population, population)

        scene.simulation.generation++

        scene.simulation.stats.push(Object.assign({}, scene.simulation.last))
        const tmp = scene.diet.slice(0, scene.config.foodcount)
        ReplaceArray(scene.diet, tmp)

        scene.simulation.last.eaten = 0
        scene.simulation.last.starved = 0

        scene.population.forEach(one => {
            one.position.x = Math.random() * scene.config.width
            one.position.y = Math.random() * scene.config.height
            //one.position.x = scene.config.center.x + Math.random() * 20 - 10
            //one.position.y = scene.config.center.y + Math.random() * 20 - 10
        })

        scene.diet.forEach(one => {
            one.position.x = Math.random() * scene.config.width
            one.position.y = Math.random() * scene.config.height
            one.eaten = false
            delete(one.cluster)
        })

        if (scene.selection.creature) {
            scene.selection.creature = scene.population.reduce((result, next) => next.id == 1 ? next : result, scene.population[0])
            scene.selection.creature.selected = true
        }
        
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
        
        const aliveCount = scene.population.filter(creature => creature.health > 0 ? true : false).length
        
        if (aliveCount > 0 && age < lifespan ) {
            return
        }

        newGeneration()

    }

    return () => (
        {
            newGeneration,
            simulate
        }
    )

}

export default simulation