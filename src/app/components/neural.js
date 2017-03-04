class Neuron {
    constructor(value = 0) {
        this.value = value
        this.synapses = []
    }
}

class Synapse {
    constructor(neuron, initialWeight = 0) {
        this.weight = initialWeight
        this.srcNeuron = neuron
    }
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

export class NeuralNet {

    constructor(shift = 0.5) {
        this.input = []
        this.output = []
        this.layers = []
        this.shift = 0.5
    }

    setInput(values) {
        //console.log(values[2], values[3])
        for(let i = 0 ; i < values.length ; i++) {
            this.input[i].value = values[i]
        }
    }

    calculate() {
        for(let level = 0 ; level < this.layers.length ; level++) {
            for(let index = 0 ; index < this.layers[level].length ; index++) {
                let sum = 0
                const synapses = this.layers[level][index].synapses
                for(let synIndex = 0 ; synIndex < synapses.length ; synIndex++) {
                    sum += synapses[synIndex].srcNeuron.value * synapses[synIndex].weight
                }
                this.layers[level][index].value = sigmoid(sum) - this.shift
                
            }
        }

        for(let index = 0 ; index < this.output.length ;  index++) {
            let sum = 0
            for(let synIndex = 0 ; synIndex < this.output[index].synapses.length ; synIndex++) {
                sum += this.output[index].synapses[synIndex].weight * this.output[index].synapses[synIndex].srcNeuron.value
            }
            this.output[index].value = sum//sigmoid(sum)// - this.shift            
        }

        return this.output.map(one => one.value)
    }

    serialize() {
        let result = this.layers
            .map(layer => 
                layer.map(neuron => 
                    neuron.synapses.map(synapse => 
                        synapse.weight
                    )
                )
            )
            .concat(
                this.output.map(output => 
                    output.synapses.map(synapse => 
                        synapse.weight
                    )
                )
            )
            .reduce((all, next) => all.concat(next), [])
            .reduce((all, next) => all.concat(next), [])

        return result
    }

    populate(weights) {
        let count = 0
        let res = []
        for(let level = 0 ; level < this.layers.length ; level++) {
            for(let index = 0 ; index < this.layers[level].length ; index++) {
                for(let synIndex = 0 ; synIndex < this.layers[level][index].synapses.length ; synIndex++) {
                    this.layers[level][index].synapses[synIndex].weight = weights.shift()
                }
            }
        }

        for(let index = 0 ; index < this.output.length ; index++) {
            for(let synIndex = 0 ; synIndex < this.output[index].synapses.length ; synIndex ++) {
                this.output[index].synapses[synIndex].weight = weights.shift()
            }
        }
    }

}


export function createNetFromDNA(DNA) {
    let net = createNet()
    net.populate(DNA)
    return net
}

export function createSeekerNetFromDNA(DNA) {
    let net = createSeekerNet()
    net.populate(DNA)
    return net
}

export function createSeekerNet() {
    const input = []

    let inputSize = 10 + 1
    let outputSize = 10
    let deepLevels = 1
    let levelSize = 10

    for(let i = 0 ; i < inputSize ; i++) {
        input.push(new Neuron(1))
    }

    let prevLayer = input
    let layers = []

    for(let level = 0 ; level < deepLevels ; level++) {

        let level1 = []

        for(let i = 0 ; i < levelSize ; i++) {
            let hiddenNeuron = new Neuron()
            for(let j = 0 ; j < prevLayer.length ; j++) {
                hiddenNeuron.synapses.push(new Synapse(prevLayer[j], Math.random() - 0.5))
            }
            level1.push(hiddenNeuron)
        }

        layers.push(level1)
        prevLayer = level1
    }

    const lastLayer = layers[layers.length - 1]

    const output = []
    for(let index = 0 ; index < outputSize ; index++) {
        let outputNext = new Neuron()
        for(let i = 0 ; i < lastLayer.length ; i++) {
            outputNext.synapses.push(new Synapse(lastLayer[i], Math.random() - 0.5))
        }
        output.push(outputNext)
    }

    const net = new NeuralNet(0)
    net.input = input
    net.layers = layers
    net.output = output
    return net

}


export function createNet(inputSize = 6, deepLevels = 6, levelSize = 6, outputSize = 3) {
    const input = []

    for(let i = 0 ; i < inputSize ; i++) {
        input.push(new Neuron(0))
    }

    let prevLayer = input
    let layers = []

    for(let level = 0 ; level < deepLevels ; level++) {

        let level1 = []

        for(let i = 0 ; i < levelSize ; i++) {
            let hiddenNeuron = new Neuron()
            for(let j = 0 ; j < prevLayer.length ; j++) {
                hiddenNeuron.synapses.push(new Synapse(prevLayer[j], Math.random() - 0.5))
            }
            level1.push(hiddenNeuron)
        }

        layers.push(level1)
        prevLayer = level1
    }
    

    let outputX = new Neuron()
    let outputY = new Neuron()
    let outputZ = new Neuron()

    const lastLayer = layers[layers.length - 1]

    for(let i = 0 ; i < lastLayer.length ; i++) {
        outputX.synapses.push(new Synapse(lastLayer[i], Math.random() - 0.5))
        outputY.synapses.push(new Synapse(lastLayer[i], Math.random() - 0.5))
        outputZ.synapses.push(new Synapse(lastLayer[i], Math.random() - 0.5))
    }

    let net = new NeuralNet()
    net.input = input
    net.layers = layers
    net.output = [outputX, outputY, outputZ]
    return net
}
