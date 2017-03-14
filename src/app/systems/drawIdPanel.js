const round = (number, d = 2) => {
    const str = number + '.0'
    const parts = str.split('\.')
    return parts[0] + '.' + parts[1].split('').slice(0, d).join('')
}

const drawIdPanel = (canvas, scene) => {

    canvas.push()

    canvas.stroke(255)
    canvas.background(0)
    canvas.noFill()
    canvas.rect(0, 0, canvas.width - 1, canvas.height)


    const creature = scene.selection.creature

    const rows = []

    rows.push('ID|' + creature.id)
    rows.push('Age|' + creature.age)
    rows.push('Health|' + creature.health)
    rows.push('Velocity|' + round(creature.velocity.x) + ', ' + round(creature.velocity.y) + ' / ' + round(creature.velocity.mag()))
    rows.push('Accel|' + round(creature.acceleration.x) + ', ' + round(creature.acceleration.y) + ' / ' + round(creature.acceleration.mag()))

    const textSize = canvas.height / 15
    const colWidth = canvas.width / 2.5
    canvas.textSize(textSize)
    canvas.fill(200)
    canvas.stroke(200)
    rows.forEach((row, index) => {
        const parts = row.split('\|')
        canvas.text(parts[0], 5, textSize * (index + 1) + 5)
        canvas.text(parts[1], colWidth, textSize * (index + 1) + 5)
    })

    canvas.pop()

}

export default drawIdPanel