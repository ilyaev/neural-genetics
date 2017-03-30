

const draw = (scene) => {

    const ships = scene.ships

    return () => {
        const canvas = scene.canvas

        const target = ships[0].target

        canvas.push()
            canvas.translate(target.x - 25, target.y - 20)
            canvas.rect(0, 0, 50, 50)
        canvas.pop()

    }

}

export default draw