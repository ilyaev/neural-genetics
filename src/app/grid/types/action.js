
export const Action = (tag, params = {}, reward = 0) => {
    return {
        tag,
        params,
        reward
    }
}

export const Actions = [
    {
        tag: 'left',
        dx: -1,
        dy: 0
    },
    {
        tag: 'right',
        dx: 1,
        dy: 0
    },
    {
        tag: 'up',
        dx: 0,
        dy: -1
    },
    {
        tag: 'down',
        dy: 1,
        dx: 0
    }
]

export default Action