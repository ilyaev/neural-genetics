

const drawNeuralNet = (net, canvas) => {

    const colCount = 2 + net.hidden.length
    const colWidth = canvas.width / colCount
    const colorFrom = canvas.color(0, 0, 0)
    const colorTo = canvas.color(0, 255, 0)
    const colorFromNegative = canvas.color(0, 0, 0)
    const colorToNegative = canvas.color(255, 0, 0)
    const nodeDiameter = colWidth / 3.2

    canvas.stroke(255)

    const layers = [net.input].concat(net.hidden).concat([net.output])
    
    let prevNodes = []

    const circles = []
    const lines = []
    const labels = []

    layers.forEach((layer, index) => {
        const rowCount = layer.length
        const cX = colWidth * index + colWidth / 2
        const nodes = []
        layer.forEach((node, nodeIndex) => {
            const cY = (canvas.height / rowCount) * nodeIndex + ((canvas.height / rowCount) / 2)
            
            prevNodes.forEach((prevNode, synIndex) => {
                const weight = node.synapses[synIndex].weight
                lines.push({
                    params: [prevNode.x, prevNode.y, cX, cY],
                    color: weight >= 0 ? canvas.lerpColor(colorFrom, colorTo, weight) : canvas.lerpColor(colorFromNegative, colorToNegative, Math.abs(weight))
                })
            })

            const nodeSize = Math.min(nodeDiameter, (canvas.height / layer.length) / 2.2)

            circles.push({
                params: [cX, cY, nodeSize, nodeSize],
                color: node.value > 0 ? canvas.lerpColor(colorFrom, colorTo, node.value) : canvas.lerpColor(colorFromNegative, colorToNegative, Math.abs(node.value))
            })

            const textSize = nodeSize / 3
            const label = node.value.toString().substr(0,4)

            labels.push({
                params: [label, cX - textSize, cY - textSize * 1.7],
                size: textSize
            })

            nodes[nodeIndex] = {
                x: cX,
                y: cY
            }
        })
        prevNodes = nodes
    })

    lines.forEach(one => {
        canvas.stroke(one.color)
        canvas.line(...one.params)
    })

    canvas.stroke(255)
    circles.forEach(one => {
        canvas.fill(one.color)
        canvas.ellipse(...one.params)
    })

    canvas.fill(255)
    labels.forEach(one => {
        canvas.textSize(one.size)
        canvas.text(...one.params)
    })

}

export default drawNeuralNet