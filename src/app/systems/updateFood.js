import p5 from 'p5'
import { Food, resupplyFood } from '../types/food'
import { Creature } from '../types/creature'
import * as Cluster from '../types/cluster'
import curry from '../lib/curry'

const update = function(scene) {

    const syncWithCluster = curry(Cluster.syncItemWithClusters)(scene.foodClusters)

    return () => {
        resupplyFood(scene.diet, scene.config.width, scene.config.height, scene.config.foodcount)
            .concat(scene.diet.filter(food => typeof food.cluster == 'undefined'))
            .forEach(syncWithCluster)
    }
    
}

export default update