import p5 from 'p5'

export const Food = (position = null, size = 5) => {

    return {
        position,
        size,
        eaten: false
    }

}

export const makeDiet = (max, maxX, maxY) => {
    
    let result = []

    for(let i = 0 ; i < max ; i++) {
        result.push(Food(new p5.Vector(Math.random() * maxX, Math.random() * maxY)))
    }

    return result
}

export const nearestFood = (diet, position) => {
    return diet
        .filter(food => food.eaten ? false : true)
        .map(food => ({
            dist: p5.Vector.dist(food.position, position),
            food
        }))
        .sort((a,b) => a.dist > b.dist ? 1 : -1)
        [0].food
}

export const resupplyFood = (diet, maxX, maxY, foodcount) => {

    // const supplyCount = diet.filter(food => food.eaten ? false : true).length

    // if (supplyCount > foodcount) {
    //     console.log('purge!', supplyCount)
    //     diet = diet.filter(food => food.eaten ? false : true)
    //     console.log(diet.length)
    // }

    diet
        .filter(food => food.eaten ? true : false)
        .forEach(food => {
            food.position = new p5.Vector(Math.random() * maxX, Math.random() * maxY)
            food.eaten = false
        })
}

export const spawnFood = (diet, x, y) => {
    diet.push(Food(new p5.Vector(x,y)))
}