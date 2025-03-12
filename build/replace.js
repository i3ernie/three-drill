export default function( obj ){
    
    return { 
        name : "replace",
        generateBundle : function( code, code2 ){ 
            for ( var key in obj ){
                const replacer = new RegExp(key, 'g')
                for ( var file in code2 ) {
                    if (code2[file].code) code2[file].code = code2[file].code.replace(replacer, obj[key] );
                }
            }
        }
    };
    
};