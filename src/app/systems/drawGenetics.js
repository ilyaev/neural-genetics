import { calculateFitness } from '../types/creature'

const map = (value, srcMax, scaleMax) => {
    return scaleMax * (value / srcMax)
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

    const chartWidth = canvas.width * 0.75
    const chartHeight = canvas.height

    const intervalWidth = chartWidth / (intervals - 1)

    const offsetX = canvas.width * 0.25
    const offsetY = 0 + chartHeight

    const vertexes = {}

    let nextX = 0
    let nextY = 0

    const prev = []

    const colors = {
        maxFitness: [0, 200, 0],
        meanFitness: [125, 125, 0],
        eaten: [200, 0, 0],
        starved: [0, 125, 125]
    }

    canvas.push()

        stats.forEach((stat, index) => {

            nextX = offsetX + (index * intervalWidth)
            
            Object.keys(globalMaxes).forEach(key => {
                if (typeof vertexes[key] == 'undefined') {
                    vertexes[key] = []
                }
                nextY = offsetY - map(stat[key], globalMaxes[key], chartHeight)
                vertexes[key].unshift([nextX, nextY])
            })
        })

        canvas.strokeWeight(2)
        
        canvas.noFill()

        Object.keys(vertexes).forEach(key => {
            if (typeof colors[key] != 'undefined') {
                canvas.stroke(...colors[key])
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

    drawCharts(canvas, scene)

}

export default drawGenetics