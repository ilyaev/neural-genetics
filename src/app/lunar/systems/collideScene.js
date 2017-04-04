import { removeShip, deactivateShip } from '../scene'


const collide = function(scene) {

    const getShip = (pair) => {
        const id = [pair.bodyA, pair.bodyB].reduce((result, next) => next.label == 'ship' ? next.id : result, false)
        const ship = scene.ships.reduce((result, next) => next.id == id ? next : result, false)
        return ship
    }

    const getWall = (pair) => {
        return [pair.bodyA, pair.bodyB].reduce((result, next) => next.label != 'ship' ? next : result, false)
    }

    return (pair) => {
        const ship = getShip(pair)
        const wall = getWall(pair)
        deactivateShip(ship, wall.label == 'floor')
    }

}

export default collide