import config from './config'
import Cell, { cellHash, cellHashByXY } from './types/cell'
import State, { updateAction, genStateTag } from './types/state'
import Action, { Actions } from './types/action'
import Agent from './types/agent'
import curry from '../lib/curry'
import { NeuralNet, calculateNetOutput } from '../types/neural'

const scene = {
    active: true,
    timeScale: 1,
    cells: [],
    cellMap: {},
    agent: false,
    maxX: 0,
    maxY: 0,
    config,
    states: [],
    net: new NeuralNet(2, 1, 7, 4, () => Math.random() * 2 - 1),
    stateMap: {}
}

const getCellByXYFromScene = (scene,x,y) => {
    return scene.cellMap[cellHashByXY(x,y)]
}

const getStateFromScene = (scene, tag) => {
    return scene.stateMap[tag]
}

export const getCellByXY = curry(getCellByXYFromScene)(scene)
export const getState = curry(getStateFromScene)(scene)


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
            const state = new State(cell.x, cell.y)
            state.reward = -0.05
            Actions.forEach(one => {
                const action = new Action(one.tag, one, 0)
                updateAction(state, action)
            })
            scene.states.push(state)
            scene.stateMap[state.tag] = state
        }
    }
    
    getState(genStateTag(Math.round(Math.random() * scene.maxX), Math.round(Math.random()*scene.maxY))).reward = 1
    getState(genStateTag(Math.round(Math.random() * scene.maxX), Math.round(Math.random()*scene.maxY))).reward = -1
    getState(genStateTag(Math.round(Math.random() * scene.maxX), Math.round(Math.random()*scene.maxY))).reward = 1
    getState(genStateTag(Math.round(Math.random() * scene.maxX), Math.round(Math.random()*scene.maxY))).reward = -1

    scene.agent = new Agent(1,1)
    scene.agent.cell = getCellByXY(0,0)
}

initScene()

export default scene