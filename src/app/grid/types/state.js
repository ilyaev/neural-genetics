export const genStateTag = (...params) => {
    return params.join(';')
}

export const State = (...params) => {
    return {
        tag: genStateTag(...params),
        reward: 0,
        actions: [],
        actionMap: {}
    }
}

export const updateAction = (state, action) => {
    state.actions = state.actions.filter(one => one.tag != action.tag).concat(action)
    state.actionMap[action.tag] = action
}

export default State