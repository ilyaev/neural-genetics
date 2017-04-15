import Matter from 'matter-js'
import p5 from 'p5'
import compose from '../../lib/compose'
import * as Neural from '../../types/neural'
import { deactivateShip } from '../scene'

const updateShips = function(scene) {

    const ships = scene.ships
    let prevOutput = []

    const calculate = (net) => {
        Neural.calculateNetOutput(net)
        return net.output.map(one => one.value)
    }

    const calculateScore = (ship) => {
        ship.age += 1

        const vToLanding = p5.Vector.sub(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y)).setMag(1) 
        const dist = p5.Vector.dist(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y))
        const distNorm = dist / scene.config.width

        if (ship.active && ship.started) {
            ship.score += 10 - (dist / 50)
        }

        if (Math.abs(dist) < 10 && ship.body.speed < 1) {
            console.log('deactive')
            deactivateShip(ship)
            ship.score += 1000 * (1 - ship.body.speed) ///ship.fuel * 10
            ship.score += ship.fuel * 10
            
        }

        return ship
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
        })
        return ship
    }

    const generateCommand = (ship) => {

        const vToLanding = p5.Vector.sub(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y)).setMag(1)

        const input = [
            scene.canvas.map(ship.body.position.x, 0, scene.config.width, -1, 1),
            scene.canvas.map(ship.body.position.y, 0, scene.config.height, -1, 1),
            vToLanding.x,
            vToLanding.y,
            scene.canvas.map(ship.fuel, 0, 150, 0, 1),
            scene.canvas.map(Math.abs(ship.body.angle) % 6.28, 0, 6.28, 0, 1),
            ship.body.velocity.x / 5,
            ship.body.velocity.y / 5,
            1 - (p5.Vector.dist(ship.target, new p5.Vector(ship.body.position.x, ship.body.position.y)) / scene.config.height)
        ]

        Neural.setNetInputValues(ship.net, input)
        const output = calculate(ship.net)
        prevOutput = output

        ship.jets.forEach((jet, index) => {
            const magnitude = 0.1
            jet.force = output[index] > 0 ? output[index] * magnitude : 0
            if (jet.force > 0) {
                ship.fuel -= output[index]
            }
        })

        return ship
    }

    const updateComposer = compose(
        calculateScore,
        applyJetForces,
        generateCommand
    )

    return () => {
        ships.filter(ship => ship.fuel > 0).map(updateComposer)
    }

}

export default updateShips