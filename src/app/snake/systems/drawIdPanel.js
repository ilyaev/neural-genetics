const round = (number, d = 2) => {
    const str = number + '.0'
    const parts = str.split('\.')
    let rest = parts[1].split('').slice(0, d)
    while(rest.length < d) {
        rest.push('0')
    }
    return parts[0] + '.' + rest.join('')
}

const drawIdPanel = (canvas, scene) => {

    canvas.push()

    canvas.stroke(255)
    canvas.background(0)
    canvas.noFill()
    canvas.rect(0, 0, canvas.width - 1, canvas.height)


    let creature = scene.selection.snake

    if (scene.selection.genetics && scene.simulation.stats[scene.selection.generation]) {
        creature = scene.simulation.stats[scene.selection.generation].winner
    }

    const rows = []

    rows.push('ID|' + creature.id)
    rows.push('Category|' + creature.category)
    rows.push('Age|' + creature.age)
    rows.push('Score|' + creature.score)
    rows.push('Health|' + creature.health)
    rows.push('Velocity|' + round(creature.velocity.x) + ', ' + round(creature.velocity.y) + ' / ' + round(creature.velocity.mag()))

    const textSize = canvas.width / 15
    const colWidth = canvas.width / 2.8
    canvas.textSize(textSize)
    canvas.fill(200)
    canvas.stroke(200)
    let tX = textSize + 5
    rows.forEach((row, index) => {
        const parts = row.split('\|')
        canvas.text(parts[0], 5, tX)
        canvas.text(parts[1], colWidth, tX)
        tX += textSize
    })

    tX += 5
    canvas.text('Input', colWidth / 1.5, tX)
    tX += textSize + 5
    let input = creature.net.input.map(one => round(one.value))
    while(input.length > 0) {
        const part = input.splice(0, 4)
        canvas.text(part.join(', '), 5, tX)
        tX += textSize
    }


    canvas.pop()

}

export default drawIdPanel