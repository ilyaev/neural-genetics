const crossover = (male, female, meta, mutationRate = 0.1) => {
    let len = Math.round(Math.random()*(male.length / 2)) + 1
    //len = Math.round(Math.random() * 3) + 1
    let maleFirst = true
    let childOne = []
    let childTwo = []

    while(male.length > 0) {
        let mPart = shiftFromArray(male, len)
        let fPart = shiftFromArray(female, len)

        if (Math.random() < mutationRate) {
            const mutant = Math.random() * 2 - 1
            const mutPlace = Math.round(Math.random()*len)
            meta.mutations += 1
            if (Math.random() < 0.5) {                
                mPart[mutPlace] = mutant
            } else {
                fPart[mutPlace] = mutant
            }
        }

        if (maleFirst) {
            childOne = childOne.concat(mPart)
            childTwo = childTwo.concat(fPart)
            maleFirst = false
        } else {
            childOne = childOne.concat(fPart)
            childTwo = childTwo.concat(mPart)
            maleFirst = true
        }
        //len = Math.round(Math.random()*(male.length / 2)) + 1
    }
    return [childOne, childTwo]
}


var shiftFromArray = function(array, count) {
    let result = []
    for(let i = 0 ; i < count ; i++) {
        if (array.length > 0) {
            result.push(array.shift())
        }
    }
    return result
}


export default crossover