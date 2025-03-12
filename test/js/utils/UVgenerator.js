import {Vector2} from "three";

const defaults = {
    box : true,
    verbose : true,
    wrapScale : new Vector2(2,2),
    uvs :   [{
                offset : [0,0],
                size   : [50,50]
            }],
       startCount :  Object.freeze(
        {
            "left" : 0, 
            "right": 1, 
            "top"  : 2, 
            "bot"  : 3, 
            "front": 4, 
            "back" : 5 
        })
};

const UVgenerator = function( opts ){

    if(opts.uvs && !Array.isArray(opts.uvs)){
        opts.uvs = [opts.uvs] ;
    }
    

    this.options = Object.assign( {}, defaults, opts );
    //console.log(this.options);
};

UVgenerator.prototype = Object.assign( UVgenerator.prototype, {

   
    setUVs : function( uvs )
    {
        this.options.uvs = uvs && Array.isArray(uvs)? uvs : [uvs];
        //console.log("setting2", this.options);
    },

 

    normalizeCorpus : function( parts, obj )
    {
        //parts : all Boxes to make a corpus 

        
        // 1: scale all uv s

        Object.values( parts ).forEach( element => {
            this.normalizeBox( element );
        });



        // 2: scale all offsets


        // offset : left top = (0,-y)
        
       
        // from corpus::part::Fl.oorbox
        let geo = parts.geoFl;
        // shift the "top" face -> offset to  x = left, y = top
        this.generateOffset(geo, "top", "lefttop");
        this.arrangeGroups(obj);
      
    },

  
 
    arrangeGroups : function( obj , name)
    {
        let numOfMaterials = this.options.uvs.length;
        obj.groups = obj.patterns[numOfMaterials-1].matrix; 
    },



    generateOffset : function( geo, reqNormal, offsetType  )
    {
        //geo : BoxGeometry 
        //reqNormal : which facelist ? text : top,bot, left,right, front, back 
        //offsetType

        let rect ;

        if( reqNormal === "top" ){
            rect = new Vector2( geo.parameters.width, geo.parameters.depth );
        }

        if( offsetType === "lefttop" ){
            let shiftx = 0;
            let shifty = -( rect.y / 50.0 - 1.0 ) / 2;   // 50 is granularity of material
            
            let shift = new Vector2( shiftx, shifty );
            
            this.shiftUVs(geo, shift, reqNormal);
        }
    },




    normalizeBox : function( geo )
        {
            //geo : BoxGeometry 
            //normalize : default : scaling : yes, offset : no 
            //for a Box, we have  geo.parameters

            let size = 100;  // wrap frequency in cm


            size = this.options.uvs[0].size[0];
    

            let width  =  geo.parameters.width / size;
            let height =  geo.parameters.height / size;
            let depth  =  geo.parameters.depth / size;

            // scaling the flat area ( group )
            let wh = new Vector2( width, height );
            let wd = new Vector2( width, depth );
            let dh = new Vector2( depth, height );

            // optimized version for BoxGeometry
            this.scaleUVsBox( geo, dh, "left"  );
            this.scaleUVsBox( geo, dh, "right" );
            this.scaleUVsBox( geo, wd, "top"   );
            this.scaleUVsBox( geo, wd, "bot"   );
            this.scaleUVsBox( geo, wh, "front" );
            this.scaleUVsBox( geo, wh, "back"  );
    },

    normalize : function( geo, parameters )
    {
        //normalize
        //general geometry

        let list;
    
        let width  =  parameters.width;
        let height =  parameters.height;
        let depth  =  parameters.depth;
        

        list = this.scaleUVs(geo, new Vector2( depth/100, height/100 ), "left" );
        list = this.scaleUVs(geo, new Vector2( depth/100, height/100 ), "right" );
        list = this.scaleUVs(geo, new Vector2( width/100,  depth/100 ), "top" );
        list = this.scaleUVs(geo, new Vector2( width/100,  depth/100 ), "bot" );
        list = this.scaleUVs(geo, new Vector2( width/100, height/100 ), "front" );
        list = this.scaleUVs(geo, new Vector2( width/100, height/100 ), "back" );
    },

  

    
    isEqual3 : function( attribute, i, req)
    {
        let x1 = attribute.getX( i );
        let x2 = attribute.getY( i );
        let x3 = attribute.getZ( i );
    
        let res =   x1 == req[0] &&  x2 == req[1] && x3 == req[2]; 

        return  res;
    },

    string2Normal : function( reqNormal )
    {
        let req = [0,0,0];

        reqNormal.toLowerCase();
        if(reqNormal === "left")  req[ 0 ] = 1 ;
        if(reqNormal === "top")   req[ 1 ] = 1 ;
        if(reqNormal === "front") req[ 2 ] = 1 ;
        
        if(reqNormal === "right") req[ 0 ] = -1 ;
        if(reqNormal === "bot")   req[ 1 ] = -1 ;
        if(reqNormal === "back")  req[ 2 ] = -1 ;

        return req;
        
    },
 
  
    scaleUVsBox : function( geometry, scale,  reqNormal ){
        // scale is Vector2()
        // reqNormal is text

        // convert text to faceNormals  
       
        let start = this.options.startCount[reqNormal.toLowerCase()];
  
        let uvAttribute = geometry.attributes.uv;

      
        for ( let i = 4*start; i < 4*start + 4; i ++ ) {
            let u = uvAttribute.getX( i );
            let v = uvAttribute.getY( i );
            
            u *= scale.x;
            v *= scale.y;
            uvAttribute.setXY( i, u, v );

        }
  
    },

    shiftUVsBox : function( geometry, scale,  reqNormal ){
        // shift is Vector2()
        // reqNormal is text

        // convert text to faceNormals to startIndex in groups  
       
        let start = this.options.startCount[reqNormal.toLowerCase()];
  
        let uvAttribute = geometry.attributes.uv;
      
        for ( let i = 4*start; i < 4*start + 4; i ++ ) {
            let u = uvAttribute.getX( i );
            let v = uvAttribute.getY( i );
            
            u += shift.x;
            v += shift.y;
         
            uvAttribute.setXY( i, u, v );

        }


    },


 
 

    scaleUVs : function( geometry, scale,  reqNormal ){
        // scale is Vector2()
        // reqNormal is text

        // convert text to faceNormals  
    
        let req = this.string2Normal( reqNormal );
        
        
        let uvAttribute = geometry.attributes.uv;
        let normalAttribute = geometry.attributes.normal;

        let indexList = [];

        for ( let i = 0; i < uvAttribute.count; i ++ ) {
            if(this.isEqual3(normalAttribute, i, req))
            {
                let u = uvAttribute.getX( i );
                let v = uvAttribute.getY( i );
                
                u *= scale.x;
                v *= scale.y;
                
                uvAttribute.setXY( i, u, v );

                indexList.push(i);
            }
        }
 
 
 
        return indexList;
    },

    shiftUVs : function( geometry, shift,  reqNormal ){
        // shift is Vector2()
        // reqNormal is text, eg "top", ...

        // convert text to faceNormals  
        let req = this.string2Normal( reqNormal );
        
        let uvAttribute = geometry.attributes.uv;
        let normalAttribute = geometry.attributes.normal;

        let indexList = [];  // indexes conform condition

        for ( let i = 0; i < uvAttribute.count; i ++ ) {
            if(this.isEqual3(normalAttribute, i, req))
            {
                let u = uvAttribute.getX( i );
                let v = uvAttribute.getY( i );
                
                u += shift.x;
                v += shift.y;
                
                uvAttribute.setXY( i, u, v );

                indexList.push(i);
            }
        }
        return indexList;
    },



 
    info: function(  ){
            //console.log("UVgenerator");
    }

});

export {UVgenerator}; 