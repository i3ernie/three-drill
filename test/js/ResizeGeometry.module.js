import {UVgenerator} from "./utils/UVgenerator.js";

const ResizeGeometry = (superclass) => class extends superclass {
    initUV( uv ) {
      // generator for UVs
      this.options.uv = uv ;

      this.genUVs = new UVgenerator( {uvs : uv} );   // opts = object
      this.genUVs.info();
    }

    resize( obj ) { 
      for ( let key in obj ) { 
          if ( this.options[key] ) { 
              this.options[key] = obj[key];
          }
      }      
      this.copy( this._getGeo() );
    } 
    update ( key, old, val ){
      this.copy( this._getGeo() );
    }
    
    updateUV ( uv ) { 
  //    console.log( uv.size[0] );
      // todo richard setUVs()....
      this.genUVs.setUVs( uv );    //new version
 //   Object.assign( this.genUVs.options, uv ); deprecated
    }

    initOptions ( o ){
      this.options = {};
      const scope = this;

        for ( let key in o ) {

          Object.defineProperty(this.options, key, {
            set : function( val ){
              let old = o[key]; 
              o[key] = val;
              scope.update( key, old, val );
            },
            get : function() {
              return o[key];
            },
            enumerable: true 
          });
		  }
    }
    
    initGeo ( getGeo ) {
      this._getGeo = getGeo;
      let geo = this._getGeo( this.options );
        
        this.copy( geo );
        this.name = this.options.name;

        geo.dispose();
    }
  };

  export { ResizeGeometry }