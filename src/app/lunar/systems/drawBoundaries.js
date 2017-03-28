

const draw = (scene) => {

    const ships = scene.boundaries

    return () => {
        const canvas = scene.canvas

        ships.forEach(ship => {
            canvas.push()
                canvas.noFill()
                canvas.stroke(200)
                canvas.translate(ship.body.position.x, ship.body.position.y)
                canvas.rotate(ship.body.angle)
                canvas.rectMode(canvas.CENTER)
                canvas.rect(0, 0, ship.width, ship.height)
                canvas.stroke(0, 200, 0)
            canvas.pop()
        })

    }

}

export default draw