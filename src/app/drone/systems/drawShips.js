

const draw = (scene) => {

    const ships = scene.ships
    const jetSize = 10

    return () => {
        const canvas = scene.canvas

        ships.concat(scene.selection.ship).forEach(ship => {
            canvas.push()
                if (scene.selection.ship && scene.selection.ship.id == ship.id) {
                    canvas.fill(0, 125, 0)
                    canvas.stroke(200)
                } else {
                    canvas.stroke(50)
                    canvas.noFill()
                }

                canvas.translate(ship.body.position.x, ship.body.position.y)
                canvas.rotate(ship.body.angle)
                
                canvas.rectMode(canvas.CENTER)
                canvas.rect(0, 0, ship.width, ship.height)
                
                const halfWidth = ship.width / 2
                const halfHeigh = ship.height / 2

                ship.fuel > 0 && (scene.selection.ship && scene.selection.ship.id == ship.id) && ship.jets
                    .filter(jet => jet.force > 0)
                    .forEach(jet => {
                        const x = jet.dx * halfWidth
                        const y = jet.dy * halfHeigh

                        canvas.stroke(255,0,0)
                        for(var i = 0 ; i < 5 ; i++) {
                            let jSize = jet.force * 800 + (Math.random() * 20 - 10)
                            if (jet.dy == 0) {
                                canvas.line(x, y, x + (jSize * jet.dx), y + (Math.random()*20 - 10))
                            } else {
                                canvas.line(x, y, x + (Math.random()*20 - 10), y + (jSize * jet.dy))
                            }
                        }
                    })

            canvas.pop()
        })

    }

}

export default draw