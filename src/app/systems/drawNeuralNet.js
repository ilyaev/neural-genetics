
const drawNeuralNet = (net, caption, canvas) => {
    if (typeof canvas.counter == 'undefined') {
        canvas.counter = -1
    }

    canvas.counter++

    if (canvas.counter < 30 && canvas.counter > 0) {
        return
    }

    canvas.counter = 0

    const colCount = 2 + net.hidden.length
    const colWidth = canvas.width / colCount
    const colorFrom = canvas.color(0, 0, 0)
    const colorTo = canvas.color(0, 255, 0)
    const colorFromNegative = canvas.color(0, 0, 0)
    const colorToNegative = canvas.color(255, 0, 0)
    const nodeDiameter = colWidth / 3.2

    canvas.stroke(255)
    canvas.background(0)
    canvas.noFill()
    canvas.rect(0, 0, canvas.width - 1, canvas.height - 1)

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

            const textSize = nodeSize / 2.2
            const label = node.value.toString().substr(0,4)

            labels.push({
                params: [label, cX - textSize, cY - textSize * 1.4],
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

    canvas.fill(200)
    canvas.stroke(200)
    labels.forEach(one => {
        canvas.textSize(one.size)
        canvas.text(...one.params)
    })

    if (caption) {
        const tSize = canvas.height / 20
        canvas.textSize(tSize)
        canvas.fill(255)
        canvas.stroke(255)
        canvas.text(caption, canvas.width - (tSize / 2) * caption.length, tSize)//canvas.width - caption.length * 33, canvas.height - 50)
    }

}

export default drawNeuralNet