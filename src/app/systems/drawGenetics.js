import { calculateFitness } from '../types/creature'

const map = (value, srcMax, scaleMax) => {
    return scaleMax * (value / srcMax)
}

const colors = {
    maxFitness: [235, 117, 2],
    meanFitness: [255,255,255],
    eaten: [220, 1, 40],
    starved: [61, 202, 1]
}

const drawCharts = (canvas, scene) => {

    const stats = scene.simulation.stats

    if (stats.length <= 0) {
        return
    }
    

    let globalMaxes = {
        maxFitness: 0,
        meanFitness: 0,
        eaten: 0,
        starved: 0
    }

    globalMaxes = stats.reduce((sum, stat) => {
        Object.keys(stat).forEach(key => sum[key] = stat[key] > sum[key] ? stat[key] : sum[key])
        return sum
    }, globalMaxes)
    
    
    const intervals = stats.length

    const chartWidth = canvas.width * 0.75 - 20
    const chartHeight = canvas.height

    const intervalWidth = chartWidth / (intervals - 1)

    const offsetX = canvas.width * 0.25
    const offsetY = 0 + chartHeight

    const vertexes = {}

    let nextX = 0
    let nextY = 0

    const prev = []

    canvas.push()

        stats.forEach((stat, index) => {

            nextX = offsetX + (index * intervalWidth)
            
            Object.keys(globalMaxes).forEach(key => {
                if (typeof vertexes[key] == 'undefined') {
                    vertexes[key] = []
                }
                nextY = offsetY - map(stat[key], globalMaxes[key] * 1.1, chartHeight)
                vertexes[key].unshift([nextX, nextY])
            })
        })

        canvas.strokeWeight(1)
        
        canvas.noFill()

        Object.keys(vertexes).forEach(key => {
            if (typeof colors[key] != 'undefined') {
                canvas.stroke(...colors[key])
                if (key == 'meanFitness') {
                    canvas.strokeWeight(3)
                } else {
                    canvas.strokeWeight(1)
                }
                canvas.beginShape()
                    vertexes[key].forEach(vertexParams => canvas.vertex(...vertexParams))
                canvas.endShape()
            }
        })

        

    canvas.pop()        

}

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
        'Generation: ' + last.generation + ' ( ' + Math.round((last.age / last.lifespan)*100) + '% )',
        'Mean Fitness: ' + last.meanFitness,
        'Max Fitness: ' + last.maxFitness,
        'Starved: ' + last.starved,
        'Food Eaten: ' + last.eaten,
        'Mutations: ' + simulation.mutations
    ]

    canvas.background(0)

    const textSize = canvas.height / 8
    canvas.textSize(textSize)
    canvas.fill(200)
    texts.forEach((label, index) => {
        if (label.indexOf('Max Fi') !== -1) {
            canvas.fill(...colors.maxFitness)
        } else if (label.indexOf('Mean Fi') !== -1) {
            canvas.fill(...colors.meanFitness)
        } else if (label.indexOf('Starved') !== -1) {
            canvas.fill(...colors.starved)
        } else if (label.indexOf('Food') !== -1) {
            canvas.fill(...colors.eaten)
        } else {
            canvas.fill(200)
        }
        const parts = label.split(':')
        canvas.text(parts[0], 10, 20 + textSize * (index + 1) + 5)
        canvas.text(parts[1], 165, 20 + textSize * (index + 1) + 5)
    })

    canvas.push()
    drawCharts(canvas, scene)
    canvas.noFill()
    canvas.stroke(255)
    canvas.rect(0,0,canvas.width - 1, canvas.height - 1)
    canvas.pop()
}

export default drawGenetics