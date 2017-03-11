import p5 from 'p5'


export const cluster = (topX, topY, bottomX, bottomY) => {
    return {
        id: ''+topX+topY+bottomX+bottomY,
        topX,
        topY,
        bottomX,
        bottomY
    }
}

export const getClusterByPosition = (position, clusters) => clusters
        .reduce((result, cluster) => 
            result || 
            (
                (position.x >= cluster.topX && position.x <= cluster.bottomX && position.y >= cluster.topY && position.y <= cluster.bottomY
            ) ? cluster : false), false)

export const syncItemWithClusters = (clusters, item) => {
    const cluster = getClusterByPosition(item.position, clusters)
    item.cluster = cluster ? cluster.id : -1
    return item
}

export const synPopulationWithClusters = (input, clusters) => {
    input.forEach(next => syncItemWithClusters(clusters, next))
}

export const neighbourItems = (position, population, clusters, radius, condition = () => true) => {
    const neighbourClusters = getClustersWithinRadius(clusters, position, radius)
    return population
        .filter(one => neighbourClusters.indexOf(one.cluster) == -1 ? false : true)
        .filter(condition)
}

export const nearestItem = (population, clusters, condition, position) => {
    let result = false
    const step = 100;
    let radius = step
    while(!result && radius < 1000) {
        const selection = neighbourItems(position, population, clusters, radius, condition)
        if (selection.length > 0) {
            result = selection
                .map(one => {
                    one._dist = p5.Vector.dist(position, one.position)
                    return one
                })
                .filter(one => one._dist > 0 ? true : false)
                .sort((a,b) => a._dist > b._dist ? 1 : -1)[0]
        }
        radius += step
    }
    return result
}


export const buildClusters = (clusters, input, width, height, size) => {
    const sizeX = size
    const sizeY = size
    const stepsX = Math.ceil(width / sizeX)
    const stepsY = Math.ceil(height / sizeY)

    for(let x = 0 ; x < stepsX ; x++) {
        for(let y = 0 ; y < stepsY ; y++) {
            let topX = sizeX * x
            let topY = sizeY * y
            let bottomX = Math.min(topX + sizeX, width)
            let bottomY = Math.min(topY + sizeY, height)
            clusters.push(cluster(topX, topY, bottomX, bottomY))
        }
    }

}

export const getClustersWithinRadius = (clusters, position, r) => {
    const result = []
    clusters.forEach(cluster => {
        const collide = RectCircleColliding(
            {x: position.x, y:position.y, r}, 
            {
                x: cluster.topX, 
                y: cluster.topY, 
                w: cluster.bottomX - cluster.topX, 
                h: cluster.bottomY - cluster.topY
            }
        )
        if (collide) {
            result.push(cluster.id)
        }
    })
    return result
}

// var circle={x:100,y:290,r:10};
// var rect={x:100,y:100,w:40,h:100};
function RectCircleColliding(circle, rect){
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

