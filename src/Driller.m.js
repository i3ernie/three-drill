import * as THREE from "three";
import { SUBTRACTION, INTERSECTION, ADDITION, Brush, Evaluator } from '../node_modules/three-bvh-csg/build/index.module.js';

const defaults = { 
    recursive  : true, 
    translation : false,
    useGroups : true,
    operation : SUBTRACTION
};


const _drilling = function( obj ) {
    
    const scope = this;

    if ( obj.geometry ) {
    
        const tempMesh = obj.clone( false );
        
        obj.getWorldPosition( tempMesh.position );
        obj.getWorldQuaternion( tempMesh.quaternion );

        const oPos = tempMesh.position.clone();
        const oRot = tempMesh.rotation.clone();

        const geo = new threeCSG().subtract( [tempMesh, this.driller] ).toGeometry();
        result = evaluator.evaluate( baseBrush, brush, params.operation, obj );
        geo.translate(- oPos.x , - oPos.y, - oPos.z  );
        geo.rotateX( -oRot.x );
        geo.rotateY( -oRot.y );
        geo.rotateZ( -oRot.z );

        obj.geometry = geo;
    }

    //recursive
    if ( this.options.recursive && obj.children.length > 0 ) {
        obj.children.forEach( function( child ){
            _drilling.call( scope, child );
        });
    }

    return obj;
};


class Driller {

    constructor ( opts ) {

        this.options = Object.assign({}, defaults, opts);
        this.evaluator = new Evaluator();
        this.evaluator.useGroups = this.options.useGroups;
    
    }

    
    setDriller ( driller ) {

        this.driller = new Brush( 
            driller.geometry.clone(), 
            driller.material 
        );
        this.driller.rotation.copy( driller.rotation );
        this.driller.position.copy( driller.position );
        this.driller.updateMatrixWorld();
        return this;
    
    }


    drill ( obj, opts ) {

        const o = Object.assign( this.options, opts );

        try {
            
            const pos = obj.position.clone();
            const rot = obj.rotation.clone();
            
            if ( !o.translation ) { 
                obj.position.set(0, 0, 0);
                obj.rotation.set(0, 0, 0);
            }

            let baseBrush = new Brush( obj.geometry, obj.material );
            baseBrush.rotation.copy(rot);
            baseBrush.position.copy(pos);
            baseBrush.updateMatrixWorld();

            let result = this.evaluator.evaluate( baseBrush, this.driller, o.operation );
            console.log( "result", result );

            if ( o.translation ) {
                result.geometry.translate(-pos.x, -pos.y, -pos.z);
                result.geometry.rotateX(-rot.x);
                result.geometry.rotateY(-rot.y);
                result.geometry.rotateZ(-rot.z);
            }
            
            obj.geometry = new THREE.BufferGeometry( ).copy( result.geometry );
            obj.material = result.material;
                
            obj.position.copy( pos );
            obj.rotation.copy( rot );
            

        } catch( e ) {
            console.error(e);
        }
    }

}

export {Driller};