import { getCellByXY } from '../scene'

const Agent = (x, y) => {
    return {
        x,
        y,
        command: {
            dx: 0,
            dy: 0
        },
        action: false,
        state: false,
        cell: false
    }
}

export const moveAgent = (agent, x,y) => {
    agent.x = x
    agent.y = y
    agent.command = {dx:0, dy:0}
    agent.cell = getCellByXY(x,y)
    return agent
}

export default Agent