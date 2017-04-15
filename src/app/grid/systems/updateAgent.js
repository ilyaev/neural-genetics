import p5 from 'p5'
import compose from '../../lib/compose'
import { moveAgent } from '../types/agent'

const updateAgent = function(scene) {

    const agent = scene.agent

    const generateCommand = (agent) => {
        agent.command = {
            dx: Math.round(Math.random() * 2 - 1),
            dy: Math.round(Math.random() * 2 - 1)
        }
        return agent
    }

    const executeCommand = (agent) => {
        const x = Math.min(scene.maxX, Math.max(0, agent.x + agent.command.dx))
        const y = Math.min(scene.maxY, Math.max(0, agent.y + agent.command.dy))
        
        return moveAgent(agent,x,y)
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