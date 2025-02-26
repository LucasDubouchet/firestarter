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

    // from a list of trees on fire, mark trees that might catch fire on the next iteration
    markNeighbouringTrees(treesOnFire){
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
    }
    // computes the fire propagation
    // returns whether the grid has seen a new fire cell (if there is no new fire, the sim is finished)
    computeNextStep(){

        // get every tree on fire
        var treesOnFire = this.grid.reduce((acc, current_line) => {
            acc.push(...current_line.filter(tree => tree.state == CONSTANTS.STATES.FIRE));
            return acc;
        }, [])
        // trees on fire end up in ashes...
        treesOnFire.forEach((t) => {
            t.setState(CONSTANTS.STATES.ASHES)
        })

        // get every tree in danger (computed during the previous iteration)
        const treesInDanger = this.grid.reduce((acc, current_line) => {
            acc.push(...current_line.filter(tree => tree.state == CONSTANTS.STATES.DANGER));
            return acc;
        }, [])

        // if no tree is in danger, then no tree can catch fire, end simulation
        if(treesInDanger.length == 0) return false;

        // reset trees on fire
        treesOnFire = []
        treesInDanger.forEach((t) => {
            // randomized chance of taking fire
            if(randomHelper.isTakingFire(this.percentChanceFire)){
                t.setState(CONSTANTS.STATES.FIRE);
                // if newly on fire, mark it in the new array
                treesOnFire.push(t);
            }
            else t.setState(CONSTANTS.STATES.SAFE)
        })
        // compute next trees in danger
        this.markNeighbouringTrees(treesOnFire);
    
        return true;
    }

    // from a list of trees indices, set their corresponding cells on fire and mark their neighbours as in danger
    setupInitalFires(treesOnFire) {
        treesOnFire.forEach((t) =>
        {
            if(t.x <= this.width && t.y <= this.height && t.x > 0 && t.y > 0){
                this.grid[t.x][t.y].setState(CONSTANTS.STATES.FIRE);
            }
        });
        this.markNeighbouringTrees(treesOnFire);
    }

    // resets the grid as a blank, completely safe grid 
    reset(){
        for (let index = 0; index < this.height; index++) {
            for (let index2 = 0; index2 < this.width; index2++) {
                this.grid[index][index2].setState(CONSTANTS.STATES.SAFE);
            }
        }
    }

    // computes the little wiggly animations of every cell in the grid
    animate(){
        for (let index = 0; index < this.height; index++) {
            for (let index2 = 0; index2 < this.width; index2++) {
                this.grid[index][index2].animate();
            }
        }
    }
}

export default GridController;