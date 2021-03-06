const collision = (scene) => {

    const borderRollOver = (creature) => {

        if (creature.position.x > scene.config.width) {
            creature.position.x = 0
        } else if (creature.position.x < 0) {
            creature.position.x = scene.config.width
        }

        if (creature.position.y > scene.config.height) {
            creature.position.y = 0
        } else if (creature.position.y < 0) {
            creature.position.y = scene.config.height
        }

        return creature
    }

    const borderKill = (creature) => {
        if (
            creature.position.x > scene.config.width || creature.position.x < 0 ||
            creature.position.y > scene.config.height || creature.position.y < 0 
        ) {
            creature.health = 0
        }
    }

    return () => ({
        borderRollOver,
        borderKill
    })

}

export default collision