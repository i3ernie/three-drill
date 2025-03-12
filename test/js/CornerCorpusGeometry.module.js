import {BoxGeometry, BufferGeometry}  from "three";
import * as BufferGeometryUtils from "BufferGeometryUtils";
import {UVgenerator} from "./utils/UVgenerator.js";

import { ResizeGeometry } from "./ResizeGeometry.module.js";

const defaults = { 
    width : 60,
    width2 : 80,
    height : 60,
    depth : 56,
    thick : 2,
    hinge : "left",
    name : "CorpusGeometry",
    top: true,
    bottom: true,
    uv :{
        size   : [50,50],
        offset : [0,0] 
    }
    
};


const getGeoE = function(){
    let o = this.options;

    const w2 = o.width/2;
    const w22 = o.width2/2;
    const h2 = o.height/2;
    const d2 = o.depth/2;
    const t2 = o.thick/2;

    let a = [];
    let b = [];

    this.parts2 = {};
    if ( o.hinge === "left" ) {
        this.parts = {
            geoLe : new BoxGeometry( o.depth, o.height, o.thick ).translate(-w2+d2, 0, o.width2-d2-t2),
            geoRi : new BoxGeometry( o.thick, o.height, o.depth ).translate(w2-t2, 0, 0),
            geoBa : new BoxGeometry( o.width-o.thick*2, o.height, o.thick ).translate( 0, 0, -d2+t2 ),
            geoBa2 : new BoxGeometry( o.thick, o.height, o.width2-o.thick ).translate(-w2+t2, 0, w22-d2-t2),
            geoFr : new BoxGeometry( o.width-o.thick*2, 4, o.thick ).translate( 0, h2-2, d2-t2 )
        };

        if ( o.bottom ){
            Object.assign( this.parts2, {
                geoFl : new BoxGeometry( o.width-o.thick*2, o.thick, o.depth).translate(0, -h2+t2, 0),
                geoFl2 : new BoxGeometry( o.depth-o.thick, o.thick, o.width2-o.depth-o.thick).translate(-w2+d2+t2, -h2+t2, d2-t2+(o.width2-o.depth)/2)
            });
        }  
        if ( o.top ){
            Object.assign( this.parts2, {
                geoTo : new BoxGeometry( o.width-o.thick*2, o.thick, o.depth).translate(0, h2-t2, 0),
                geoTo2 : new BoxGeometry( o.depth-o.thick, o.thick, o.width2-o.depth-o.thick).translate(-w2+d2+t2, h2-t2, d2-t2+(o.width2-o.depth)/2)
            });
        }  
    }
    else {
        this.parts = {
            geoLe : new BoxGeometry( o.depth, o.height, o.thick ).translate(w2-d2, 0, o.width2-d2-t2),
            geoRi : new BoxGeometry( o.thick, o.height, o.depth ).translate(-w2+t2, 0, 0),
            geoBa : new BoxGeometry( o.width-o.thick*2, o.height, o.thick ).translate( 0, 0, -d2+t2 ),
            geoBa2 : new BoxGeometry( o.thick, o.height, o.width2-o.thick ).translate(w2-t2, 0, w22-d2-t2),
            geoFr : new BoxGeometry( o.width-o.thick*2, 4, o.thick ).translate( 0, h2-2, d2-t2 )
        };
        
        if ( o.bottom ){
            Object.assign( this.parts2, {
                geoFl : new BoxGeometry( o.width-o.thick*2, o.thick, o.depth).translate(0, -h2+t2, 0),
                geoFl2 : new BoxGeometry( o.depth-o.thick, o.thick, o.width2-o.depth-o.thick).translate(w2-d2-t2, -h2+t2, d2-t2+(o.width2-o.depth)/2)
            });
        }  
        if ( o.top ){
            Object.assign( this.parts2, {
                geoTo : new BoxGeometry( o.width-o.thick*2, o.thick, o.depth).translate(0, h2-t2, 0),
                geoTo2 : new BoxGeometry( o.depth-o.thick, o.thick, o.width2-o.depth-o.thick).translate(-w2+d2+t2, h2-t2, d2-t2+(o.width2-o.depth)/2)
            });
        } 
    }

    let k;
    for ( k in this.parts ){
        a.push( this.parts[ k ] );
    }

    for ( k in this.parts2 ){
        b.push( this.parts2[ k ] );
    }

    let geo;
    if ( b.length > 0 ){
        let geo1 = BufferGeometryUtils.mergeBufferGeometries( a, false );
        let geo2 = BufferGeometryUtils.mergeBufferGeometries( b, false );
        geo = BufferGeometryUtils.mergeBufferGeometries( [ geo1, geo2], true );
    } 
    else {
        geo = BufferGeometryUtils.mergeBufferGeometries( a, true );
    }

    geo.computeBoundingBox();
    geo.center();

    return geo;
};



/**
 * class CornerCorpusGeometry
 */
class CornerCorpusGeometry extends ResizeGeometry(BufferGeometry) {
    constructor ( opts, uv ){

        let o = Object.assign( {}, defaults, opts );

        super();

        o.uv = uv || defaults.uv;
        this.genUVs = new UVgenerator( o.uv );
        this.genUVs.info();

        this.options = o;
        this._getGeo = getGeoE;

        let geo = this._getGeo();

        geo.name = o.name;
        
        this.copy( geo );
    }

    resize( obj ) {
        for ( let key in obj ) { 
            if ( defaults[key] ) { 
                this.options[key] = obj[key];
            }
        } 
        
        this.copy( this._getGeo() );
    }

    updateUV ( uv ) { 
        Object.assign( this.genUVs.options, uv );
    }
}

export {CornerCorpusGeometry}