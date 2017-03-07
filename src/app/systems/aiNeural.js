import { setNetInputValues, calculateNetOutput } from '../types/neural'

const ai = (scene) => {

    let net = false

    const setInput = (input) => {
        setNetInputValues(net, input)
    }

    const calculate = () => {
        calculateNetOutput(net)
        return net.output.map(one => one.value)
    }



    return (one) => {
        net = one
        return {
            setInput,
            calculate
        }
    }

    

}

export default ai