import p5 from 'p5'

export const Food = (position = null, size = 5) => {

    return {
        position,
        size
    }

}

export const makeDiet = (max, maxX, maxY) => {
    
    let result = []

    for(let i = 0 ; i < max ; i++) {
        result.push(Food(new p5.Vector(Math.random() * maxX, Math.random() * maxY)))
    }

    return result
}