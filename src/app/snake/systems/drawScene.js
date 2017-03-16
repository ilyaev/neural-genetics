import p5 from 'p5'
import snakesDrawer from './drawSnakes'
import drawFood from './drawFood'



const draw = function(scene) {

    const drawSnakes = snakesDrawer(scene)

    return () => {

        const canvas = scene.canvas

        canvas.background(0)
        canvas.noFill()
        canvas.stroke(200)
        canvas.rect(0, 0, scene.config.width, scene.config.height)

        drawSnakes()
        drawFood(canvas, scene.diet)
    }    

}

export default draw