import config from './config'
import curry from '../lib/curry'
import {XORNet} from './types/neural'

const scene = {
    active: true,
    net: new XORNet(),
    timeScale: 100,
    calculated: false,
    batch: [
        [0,0],
        [1,1],
        [0.5, 0.5]
    ],
    goals: [
        [1,1],
        [0,0],
        [0.15, 0.5]
    ],
    epoch: 0
}

const initScene = () => {
    
}

initScene()

export default scene