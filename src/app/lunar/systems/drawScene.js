import p5 from 'p5'
import compose from '../../lib/compose'


const draw = function(scene) {

    const setup = (canvas) => {
        canvas.background(0)
        canvas.noFill()
        canvas.stroke(200)
        canvas.rect(0, 0, scene.config.width, scene.config.height)
        return canvas
    }

    return () => {

        compose(
            setup
        )(scene.canvas)
        
    }    

}

export default draw