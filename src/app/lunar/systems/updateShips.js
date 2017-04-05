import Matter from 'matter-js'
import p5 from 'p5'
import compose from '../../lib/compose'
import * as Neural from '../../types/neural'

const updateShips = function(scene) {

    const ships = scene.ships

    const calculate = (net) => {
        Neural.calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const applyJetForces = (ship) => {
        ship.jets.forEach(jet => {
            const v = new p5.Vector(jet.dx, jet.dy)
                .rotate(ship.body.angle)
                .add(new p5.Vector(ship.body.position.x, ship.body.position.y))

            let vForce = p5.Vector.sub(new p5.Vector(ship.body.position.x, ship.body.position.y), new p5.Vector(v.x, v.y))

            let vPoint = new p5.Vector(ship.body.position.x + (10 * jet.dx), ship.body.position.y - (1 * Math.abs(jet.dx)))

            vForce = vForce.setMag(jet.force)

            Matter.Body.applyForce(ship.body, vPoint, vForce)
            //Matter.Body.rotate(ship.body, 0.3)
        })
        return ship
    }

    const generateCommand = (ship) => {

        const vToLanding = p5.Vector.sub(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y)).setMag(1)

        //console.log('bosy', ship.body)
        //sdfsdf.sdfsdf()

        const input = [
            scene.canvas.map(ship.body.position.x, 0, scene.config.width, 0, 1),
            scene.canvas.map(ship.body.position.y, 0, scene.config.height, 0, 1),
            vToLanding.x,
            vToLanding.y,
            scene.canvas.map(ship.fuel, 0, 200, 0, 1),
            scene.canvas.map(Math.abs(ship.body.angle) % 6.28, 0, 6.28, 0, 1),
            ship.body.velocity.x / 5,
            ship.body.velocity.y / 5,
        ]

        //sdfsdf.sdfsdf()

        Neural.setNetInputValues(ship.net, input)
        const output = calculate(ship.net)

        ship.jets.forEach((jet, index) => {
            const magnitude = index == 2 ? 0.08 : 0.03
            jet.force = output[index] > 0 ? output[index] * magnitude : 0
            if (jet.force > 0) {
                ship.fuel -= output[index]
            }
        })

        return ship
    }

    const updateComposer = compose(
        applyJetForces,
        generateCommand
    )

    return () => {
        ships.filter(ship => ship.fuel > 0).map(updateComposer)
    }

}

export default updateShips