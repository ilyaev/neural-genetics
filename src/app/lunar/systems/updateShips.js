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

            vForce = vForce.setMag(jet.force)

            Matter.Body.applyForce(ship.body, {x: ship.body.position.x, y: ship.body.position.y}, vForce)
        })
        return ship
    }

    const generateCommand = (ship) => {

        const vToLanding = p5.Vector.sub(new p5.Vector(ship.body.position.x, ship.body.position.y), ship.target).setMag(1)

        const input = [
            (ship.body.position.x / (scene.config.width / 2)) - 1,
            (ship.body.position.y / (scene.config.height / 2)) - 1,
            ((ship.body.angle % 6.28) / (scene.canvas.PI * 2)),
            vToLanding.x,
            vToLanding.y
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