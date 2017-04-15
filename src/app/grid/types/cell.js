import config from '../config'

const Cell = (x, y, size = config.cellSize) => {
    return {
        x,
        y,
        size
    }
}

export const cellHash = (cell) => {
    return cellHashByXY(cell.x, cell.y)
}

export const cellHashByXY = (x,y) => {
    return x+';'+y
}

export default Cell