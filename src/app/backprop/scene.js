import config from './config'
import curry from '../lib/curry'
import {XORNet} from './types/neural'

const scene = {
    active: true,
    net: new XORNet(),
    timeScale: 1,
    batch: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        // [0.5, 0.5],
        // [0.3, 0.3],
        // [0.2, 0.2]
    ],
    goals: [
        0, 1, 1, 0, 1, 0, 1
    ],
    epoch: 0
}

const initScene = () => {
    
}

initScene()

export default scene