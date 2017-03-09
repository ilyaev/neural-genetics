import { calculateFitness } from '../types/creature'


const drawGenetics = (canvas, scene) => {

    const simulation = scene.simulation

    if (typeof canvas.counter == 'undefined') {
        canvas.counter = -1
    }

    canvas.counter++

    if (canvas.counter < 30 && canvas.counter > 0) {
        return
    }

    canvas.counter = 0

    const last = simulation.last
    
    calculateFitness(scene.population)

    last.maxFitness = scene.population.sort((a,b) => a.fitness < b.fitness ? 1 : -1)[0].fitness    
    last.meanFitness = Math.round(scene.population.reduce((sum, next) => sum + next.fitness, 0) / scene.population.length)

    const prev = simulation.stats.length > 0 ? simulation.stats[simulation.stats.length - 1] : false
    
    const texts = [
        'GEN: ' + last.generation + ' ( ' + Math.round((last.age / last.lifespan)*100) + '% )',
        'MXF: ' + last.maxFitness + (prev ? (' ( ' + prev.maxFitness + ' )') : ''),
        'MEF: ' + last.meanFitness + (prev ? (' ( ' + prev.meanFitness + ' )') : ''),
        'STV: ' + last.starved + (prev ? (' ( ' + prev.starved + ' )') : ''),
        'FET: ' + last.eaten + (prev ? (' ( ' + prev.eaten + ' )') : '')
    ]

    canvas.background(0)

    const textSize = canvas.height / 7
    canvas.textSize(textSize)
    canvas.fill(200)
    texts.forEach((label, index) => {
        canvas.text(label, 5, textSize * (index + 1) + 5)
    })

}

export default drawGenetics