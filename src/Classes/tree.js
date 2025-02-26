import * as THREE from 'three';
import CONSTANTS from "./constants"

/**
 * Simple class representing a Tree (basically a cell of our forzest grid).
 * 
 * A tree object will not handle any logic. It only stores a state and handles its own rendering (ie having a mesh and a material)
 */





class Tree {

    constructor(x, y, scene){
        // simple logic code
        this.x = x;
        this.y = y;
        this.state = CONSTANTS.STATES.SAFE;

        // Rendering code
        const geometry = new THREE.PlaneGeometry( CONSTANTS.SIZE_MESH, CONSTANTS.SIZE_MESH );
        const material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        scene.add( plane );
        this.mesh = plane;
        this.mesh.position.x = (this.x * CONSTANTS.SIZE_MESH) + 0.1 * this.x;
        this.mesh.position.y = (this.y * CONSTANTS.SIZE_MESH) + 0.1 * this.y;
    }

    setState(state){
        this.state = state;
        // reset mesh position
        this.mesh.position.x = (this.x * CONSTANTS.SIZE_MESH) + 0.1 * this.x;
        this.mesh.position.y = (this.y * CONSTANTS.SIZE_MESH) + 0.1 * this.y;
        switch (this.state) {
            case CONSTANTS.STATES.SAFE:
                this.mesh.material.color = new THREE.Color().setHex(0x00cc11);;
                break;
            case CONSTANTS.STATES.DANGER:
                this.mesh.material.color = new THREE.Color(0.9,0.8,0);
                break;
            case CONSTANTS.STATES.FIRE:
                this.mesh.material.color = new THREE.Color(1,0,0);
                break;
            case CONSTANTS.STATES.ASHES:
                this.mesh.material.color = new THREE.Color(0.4,0.4,0.4);
                break;
            default:
                this.mesh.material.color = new THREE.Color(0,1,0);
                break;
        }
    }

    animate(){
        const time = new Date().getTime();
        switch (this.state) {
            case CONSTANTS.STATES.FIRE:
                this.mesh.position.y += Math.sin(time* 0.03) * 0.008;
                break;
            default:
                break;
        }
    }
}

export default Tree;