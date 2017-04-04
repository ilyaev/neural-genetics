import compose from '../../lib/compose'
import p5 from 'p5'
import NeuralNet, { serializeNet, populateNet } from '../../types/neural'
import doCrossover from '../../lib/crossover'
import { replace as ReplaceArray } from '../../lib/array'
import * as Ship from '../types/ship'
import { buildNewShip, putNewFleet, nextCurrentTarget } from '../scene'


const simulation = (scene) => {

    var counter = -1
    var age = 0
    var lastHash = 0
    var hashCounter = 0

    const getElite = () => {
        let maxFitness = 0
        let sumFitness = 0

        const elite = scene.ships
            .map(one => {
                if (one.fitness > maxFitness) {
                    maxFitness = one.fitness
                }
                sumFitness += (one.fitness ? one.fitness : 0)
                return one
            })
            .sort((a,b) => a.fitness > b.fitness ? -1 : 1)
            .slice(0, scene.ships.length * scene.eliteRate )
            .map((one,index) => {
                one.id = index + 1
                one.elitecount += 1
                one.category = 'elite ' + (one.elitecount > 1 ? (' +' + one.elitecount ) : '') 
                one.generation += 1
                return one
            })
        return [elite, maxFitness, sumFitness > 0 ? sumFitness / scene.ships.length : 0]
    }

    const makeNewSnake = () => {
        return buildNewShip(scene.config.center.x, scene.config.center.y)
    }

    const resupplyWithRandom = (population) => {
        while(population.length < scene.config.snakescount) {
            const creature = makeNewSnake()
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
            index = getRandomNumber(scene.ships.length - 1)
            if (index != firstParent) {
                parent = scene.ships[index]
                if (parent.fitness >= testFitness) {
                    flag = false
                }
            }
            counter += 1
        }

        return [index, parent]
        
    }

    const crossover = (population, maxFitness) => {

        while(population.length < scene.ships.length * (1 - scene.randomRate)) {
            
            let [indexMale, parentMale] = getNextParent(maxFitness)
            let [indexFemale, parentFemale] = getNextParent(maxFitness, indexMale)

            if (parentMale && parentFemale) {
            
                let mDNA = serializeNet(parentMale.net)
                let fDNA = serializeNet(parentFemale.net)

                doCrossover(mDNA, fDNA, scene.simulation, scene.mutationRate).forEach(offspringDNA => {
                    const offspring = makeNewSnake()
                    offspring.category = 'D: ' + Math.round(parentMale.fitness) + ' / ' + Math.round(parentFemale.fitness)
                    populateNet(offspring.net, offspringDNA)
                    population.push(offspring)
                })

            }
        }
    }

    const newGeneration = () => {
        age = 0

        scene.ships.forEach(Ship.calculateFitness)

        const theOne = Object.assign({}, scene.ships.sort((a,b) => a.fitness > b.fitness ? -1 : 1)[0])
        
        const [ships, maxFitness, meanFitness] = getElite()

            scene.simulation.last.maxFitness = maxFitness
        scene.simulation.last.meanFitness = meanFitness
        scene.simulation.last.generation = scene.simulation.generation

        crossover(ships, maxFitness)
        resupplyWithRandom(ships)

        //if (scene.simulation.generation % 10 == 0) {
            nextCurrentTarget()
        //}
        putNewFleet(ships)

        scene.simulation.generation++

        scene.simulation.stats.push(Object.assign({}, scene.simulation.last, {winner: theOne}))
        scene.selection.ship = scene.ships.sort((a,b) => a.fitness > b.fitness ? -1 : 1)[0]
    }

    const checkCounter = () => {
        counter++
        age++
        scene.simulation.last.age = age
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
        
        const aliveCount = scene.ships.filter(creature => creature.active).length

        if (aliveCount > 0) {
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