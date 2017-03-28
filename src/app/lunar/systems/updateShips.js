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

    const calculateJetForces = (ship) => {
        ship.jets.forEach(jet => Math.random() > 0.8 ? jet.force = Math.random() * 0.03 : jet.force = 0)
        return ship
    }

    const generateCommand = (ship) => {

        const vToLanding = p5.Vector.sub(new p5.Vector(ship.body.position.x, ship.body.position.y), new p5.Vector(scene.config.center.x, scene.config.height - 20)).setMag(1)

        const input = [
            (ship.body.position.x / (scene.config.width / 2)) - 1,
            (ship.body.position.y / (scene.config.height / 2)) - 1,
            ((ship.body.angle % 6.28) / (scene.canvas.PI * 2)),
            vToLanding.x,
            vToLanding.y
        ]

        Neural.setNetInputValues(ship.net, input)
        const output = calculate(ship.net)

        ship.jets.forEach((jet, index) => {
            jet.force = output[index] > 0 ? output[index] * 0.08 : 0
        })

        return ship
    }

    const updateComposer = compose(
        applyJetForces,
        generateCommand
        //calculateJetForces
    )

    return () => {
        ships.map(updateComposer)
    }

}

export default updateShips