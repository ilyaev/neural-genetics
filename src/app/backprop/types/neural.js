import * as Reducers from '../../lib/reducers'

const concatWeightToArray = Reducers.concatKeyToArray('weight')
const concatSynapsesToArray = Reducers.concatKeyToArray('synapses')
const concatBiasToArray = Reducers.concatKeyToArray('bias')

const Neuron = (value = 0, synapses = [], bias = 1) => {
    return {
        value,
        rawValue: value,
        error: 0,
        bias: Math.random() * 2 - 1,
        synapses
    }
}

const Synapse = (weight = 0, input = false) => {
    return {
        weight,
        input
    }
}


const NeuralNet = (inputSize = 3, hiddenLayers = 1, hiddenLayersSize = 3, outputSize = 1, weightFunction = () => Math.random()) => {

    const input = []
    const hidden = []
    const output = []

    for(let i = 0 ; i < inputSize ; i++) {
        input.push(new Neuron(0))
    }

    let lastLayer = input
    for(let i = 0 ; i < hiddenLayers ; i++) {
        const layer = []
        for(let j = 0 ; j < hiddenLayersSize ; j++) {
            layer.push(new Neuron(0, lastLayer.map(one => new Synapse(weightFunction(), one))))
        }
        hidden.push(layer)
        lastLayer = layer
    }

    for(let i = 0 ; i < outputSize ; i++) {
        output.push(new Neuron(0, lastLayer.map(one => new Synapse(weightFunction(), one)), 0))
    }

    return {
        input,
        hidden,
        output
    }
}

export const sigmoid = (z, prime = false) => {
    if (prime) {
        return z * (1 - z)
    }
    return 1 / (1 + Math.exp(-z))
}

export const tanh = (z, prime = false) => {
    if (prime) {
        return 1 - (z * z)
    }
    return (2 / (1 + Math.exp(-2*z))) - 1
}

export const setNetInputValues = (net, input) => {
    net.input.forEach((one, index) => one.value = input[index] ? input[index] : 0)
}

export const calculateNeuronValue = (neuron) => {
    neuron.rawValue = neuron.bias + neuron.synapses.reduce((sum, next) => sum + next.weight * next.input.value, 0)
    neuron.value = sigmoid(neuron.rawValue)
}

export const calculateNetOutput = (net) => {

    net.hidden.forEach(layer => layer.forEach(calculateNeuronValue))
    net.output.forEach(calculateNeuronValue)
    return net.output
}

export const calculateErrors = (net, expected, actual) => {
    net.output.forEach((node, i) => {
        node.error = (expected[i] - actual[i]) * sigmoid(actual[i], true)
    })

    net.hidden[0].forEach((node, i) => {
        let sum = 0
        net.output.forEach((out, k) => {
            sum += out.synapses[i].weight * out.error
        })
        node.error = sigmoid(node.value, true) * sum
    })
}

export const calculateGlobalError = (net, expected, actual) => {
    let result = 0
    expected.forEach((target, i) => result += Math.pow(target - actual[i], 2) * 0.5)
    return result
}

export const backPropagateError = (net) => {

    const learningRate = 0.1

    net.output.forEach(node => {
        node.bias += node.error
        node.synapses.forEach(synapse => synapse.weight += node.error * synapse.input.value * learningRate)
    })
    net.hidden[0].forEach(node => {
        node.bias += node.error
        node.synapses.forEach(synapse => {
            synapse.weight += node.error * synapse.input.value * learningRate
        })
    })
}

export const train = (net, inputs, expected) => {
    let globalError = 1
    let epoch = 0
    let limitEpoch = 20000
    let limitError = 0.005

    while(epoch < limitEpoch && globalError > limitError) {
        globalError = 0
        inputs.forEach((state, index) => {
            setNetInputValues(net, state)
            const output = calculateNetOutput(net).map(one => one.value)
            calculateErrors(net, expected[index], output)
            backPropagateError(net)
            globalError += calculateGlobalError(net, expected[index], output)
        })
        epoch += 1
    }
    
    return epoch >= limitEpoch ? false : true
}

export const serializeNet = (net) => {

    const neurons = [
        net.hidden.reduce(Reducers.concatToArray, []),
        net.output
    ]
    .reduce(Reducers.concatToArray, [])

    return neurons
            .reduce(concatSynapsesToArray, [])
            .reduce(concatWeightToArray, [])
            .concat(neurons
                .reduce(concatBiasToArray, [])
            )
}

export const populateNet = (net, data) => {

    net.hidden.forEach(layer => layer.forEach(node => node.synapses.forEach(synapse => synapse.weight = data.shift())))
    net.output.forEach(node => node.synapses.forEach(synapse => synapse.weight = data.shift()))

    net.hidden.forEach(layer => layer.forEach(node => node.bias = data.shift()))
    net.output.forEach(node => node.bias = data.shift())

    return net
}

export const XORNet = () => NeuralNet(
    2,1,5,2, () => Math.random() * 2 - 1
)

export default NeuralNet