import Tree from "../Classes/tree";
import CONSTANTS from "../Classes/constants";
import randomHelper from "../Helpers/random-helper";

// represents the kernel which can take fire around a tree
const KERNEL = [
    {x: 0, y:1},
    {x: 0, y:-1},
    {x: -1, y:0},
    {x: 1, y:0},
]


/**
 * A grid of trees, representing a forest. 
 * This class handles the logic of the simulation.
 */

class GridController {

    constructor(width, height,fireProbability, scene){
        this.width = width;
        this.height = height;
        this.grid = new Array();
        for (let index = 0; index < this.height; index++) {
            this.grid.push([]);
            for (let index2 = 0; index2 < this.width; index2++) {
                this.grid[index].push(new Tree(index, index2, scene))
                
            }
        }
        this.percentChanceFire = fireProbability;
    }


    setNeighboursOnFire(cell){
        var change = false
        KERNEL.forEach((k) => {
            const newPosition = {x: cell.x + k.x, y: cell.y + k.y}
            // is the new position still in the grid?
            if(newPosition.x >=0  && newPosition.x < this.width && newPosition.y >=0  && newPosition.y < this.height) {
                // an ashe cell won't catch fire again
                if(this.grid[newPosition.x][newPosition.y].state != CONSTANTS.STATES.ASHES) {
                    // randomized check
                    if (randomHelper.isTakingFire(this.percentChanceFire)) {
                        this.grid[newPosition.x][newPosition.y].setState(CONSTANTS.STATES.FIRE)
                        change = true;
                    }
                }
            }
        });
        return change;
    }

    // computes the fire propagation
    // returns whether the grid has seen a new fire cell (if there is no new fire, the sim is finished)
    computeNextStep(){

        const treeInDanger = this.grid.reduce((acc, current_line) => {
            acc.push(...current_line.filter(tree => tree.state == CONSTANTS.STATES.DANGER));
            return acc;
        }, [])

        treeInDanger.forEach((t) => {
            t.setState(CONSTANTS.STATES.SAFE)
        })


        // get every tree on fire
        var treesOnFire = this.grid.reduce((acc, current_line) => {
            acc.push(...current_line.filter(tree => tree.state == CONSTANTS.STATES.FIRE));
            return acc;
        }, [])

        var newFire = false;
        treesOnFire.forEach((t) => {
            t.setState(CONSTANTS.STATES.ASHES)
            // compute every neighbour that the fire can propagate to
            var neighbourChanged = this.setNeighboursOnFire(t);
            if(neighbourChanged) newFire = true;
        })

        // reset trees on fire

        treesOnFire = this.grid.reduce((acc, current_line) => {
            acc.push(...current_line.filter(tree => tree.state == CONSTANTS.STATES.FIRE));
            return acc;
        }, [])

        // mark trees that might catch fire on the next iteration
        treesOnFire.forEach((t) => {
            KERNEL.forEach((k) => {
                const newPosition = {x: t.x + k.x, y: t.y + k.y}
                // is the new position still in the grid?
                if(newPosition.x >=0  && newPosition.x < this.width && newPosition.y >=0  && newPosition.y < this.height) {
                    if(this.grid[newPosition.x][newPosition.y].state == CONSTANTS.STATES.SAFE) {
                            this.grid[newPosition.x][newPosition.y].setState(CONSTANTS.STATES.DANGER)
                    }
                }
            });
        })
    
        return newFire;
    }

    setupInitalFires(treesOnFire) {
        treesOnFire.forEach((t) =>
        {
            if(t.x <= this.width && t.y <= this.height && t.x > 0 && t.y > 0){
                this.grid[t.x-1][t.y-1].setState(CONSTANTS.STATES.FIRE);
            }
        })
    }

    reset(){
        for (let index = 0; index < this.height; index++) {
            for (let index2 = 0; index2 < this.width; index2++) {
                this.grid[index][index2].setState(CONSTANTS.STATES.SAFE);
                
            }
        }
    }

    animate(){
        for (let index = 0; index < this.height; index++) {
            for (let index2 = 0; index2 < this.width; index2++) {
                this.grid[index][index2].animate();
                
            }
        }
    }
}

export default GridController;