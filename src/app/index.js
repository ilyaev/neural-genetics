import Sketch from './main'
import SnakeSketch from './snake/main'

const target = document.getElementById('app')

window.onload = () => {
    const hash = window.location.hash.replace('#', '').trim()
    let demo = false
    
    switch(hash) {
        case 'snake':
            demo = new SnakeSketch(target)
            break
        default:
            demo = new Sketch(target)
    }

    return demo

}