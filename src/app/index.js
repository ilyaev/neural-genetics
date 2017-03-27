import Sketch from './main'
import SnakeSketch from './snake/main'
import LunarSketch from './lunar/main'

const target = document.getElementById('app')

window.onload = () => {
    const hash = window.location.hash.replace('#', '').trim()
    let demo = false

    switch(hash) {
        case 'snake':
            demo = new SnakeSketch(target)
            break
        case 'lunar':
            demo = new LunarSketch(target)
            break
        default:
            demo = new Sketch(target)
    }

    return demo

}