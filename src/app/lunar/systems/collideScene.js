import { removeShip, deactivateShip } from '../scene'


const collide = function(scene) {

    const getShip = (pair) => {
        const id = [pair.bodyA, pair.bodyB].reduce((result, next) => next.label == 'ship' ? next.id : result, false)
        const ship = scene.ships.reduce((result, next) => next.id == id ? next : result, false)
        return ship
    }

    return (pair) => {
        const ship = getShip(pair)
        deactivateShip(ship)
    }

}

export default collide