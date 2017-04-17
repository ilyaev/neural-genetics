import p5 from 'p5'
import compose from '../../lib/compose'
import { moveAgent } from '../types/agent'
import { genStateTag } from '../types/state'
import { getState } from '../scene'

const updateAgent = function(scene) {

    const agent = scene.agent

    const generateCommand = (agent) => {
        agent.state = getState(genStateTag(agent.cell.x, agent.cell.y))
        agent.action = agent.state.actions[Math.floor(Math.random() * agent.state.actions.length)]
        agent.command = {
            dx: agent.action.params.dx,
            dy: agent.action.params.dy
        }
        return agent
    }

    const executeCommand = (agent) => {
        const x = Math.min(scene.maxX, Math.max(0, agent.x + agent.command.dx))
        const y = Math.min(scene.maxY, Math.max(0, agent.y + agent.command.dy))
        agent = moveAgent(agent,x,y)
        const newState = getState(genStateTag(x,y))
        const reward = newState.reward

        const maxAction = newState.actions.reduce((result, next) => {
            return next.reward > result.reward ? next : result
        }, newState.actions[0])

        agent.action.reward = agent.action.reward + (reward + maxAction.reward - agent.action.reward) / 2

        if (Math.abs(newState.reward) == 1) {
            agent = moveAgent(agent,0,0)
        }
        return agent
    }

    const updateComposer = compose(
        executeCommand,
        generateCommand
    )

    return () => {
        updateComposer(agent)
    }

}

export default updateAgent