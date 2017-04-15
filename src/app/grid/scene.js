import config from './config'
import Cell, { cellHash, cellHashByXY } from './types/cell'
import Agent from './types/agent'
import curry from '../lib/curry'

const scene = {
    active: true,
    timeScale: 1,
    cells: [],
    cellMap: {},
    agent: false,
    maxX: 0,
    maxY: 0,
    config
}

const getCellByXYFromScene = (scene,x,y) => {
    return scene.cellMap[cellHashByXY(x,y)]
}

export const getCellByXY = curry(getCellByXYFromScene)(scene)


const initScene = () => {
    const rows = Math.ceil(config.height / config.cellSize)
    const cols = Math.floor(config.width / config.cellSize)
    scene.maxX = cols - 1
    scene.maxY = rows - 1

    for(let x = 0 ; x < cols ; x++) {
        for(let y = 0 ; y < rows ; y++) {
            const cell = new Cell(x,y)
            scene.cells.push(cell)
            scene.cellMap[cellHash(cell)] = cell
        }
    }

    scene.agent = new Agent(1,1)
    scene.agent.cell = getCellByXY(0,0)
}

initScene()

export default scene