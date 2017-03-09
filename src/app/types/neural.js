import * as Reducers from '../lib/reducers'

const concatWeightToArray = Reducers.concatKeyToArray('weight')
const concatSynapsesToArray = Reducers.concatKeyToArray('synapses')

const Neuron = (value = 0, synapses = [], bias = 1) => {
    return {
        value,
        rawValue: value,
        bias,
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

export const sigmoid = (z) => {
  return 1 / (1 + Math.exp(-z))
}

export const tanh = (z) => {
    return (2 / (1 + Math.exp(-2*z))) - 1
}

export const setNetInputValues = (net, input) => {
    net.input.forEach((one, index) => one.value = input[index] ? input[index] : 0)
}

export const calculateNeuronValue = (neuron) => {
    const shift = (5 / (neuron.synapses.length + 1))
    neuron.rawValue = neuron.bias + neuron.synapses.reduce((sum, next) => sum + next.weight * next.input.value * shift, 0)
    neuron.value = tanh(neuron.rawValue)
}

export const calculateNetOutput = (net) => {

    net.hidden.forEach(layer => layer.forEach(calculateNeuronValue))
    net.output.forEach(calculateNeuronValue)

}

export const serializeNet = (net) => {
    return [
        net.hidden.reduce(Reducers.concatToArray, []),
        net.output
    ]
    .reduce(Reducers.concatToArray, [])
    .reduce(concatSynapsesToArray, [])
    .reduce(concatWeightToArray, [])
}

export const populateNet = (net, data) => {

    net.hidden.forEach(layer => layer.forEach(node => node.synapses.forEach(synapse => synapse.weight = data.shift())))
    net.output.forEach(node => node.synapses.forEach(synapse => synapse.weight = data.shift()))

    return net
}

const RandomWeightNeuralNet = () => NeuralNet(
    10, // Input Size
    1, // Hidden Layers number
    8, // Hidden Layer size
    3, // Output Size
    () => Math.random() * 2 - 1
)

export default RandomWeightNeuralNet