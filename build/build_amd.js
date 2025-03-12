import {rollup}  from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from "./replace.js";


const build_AMD = function( data, done ){
    
   const conf = data;
   
    rollup({
        input : conf.amd.input,
        external: conf.external,
        
        plugins:[
            nodeResolve()
        ]

    }).then(( bundle ) => { 

        bundle.write({
            file: conf.amd.output,

            plugins:[
                replace( conf.amd.replace )
            ],
            
            format: 'amd',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done( );

    }).catch(
        ( err ) => {
            console.error( err );
            done( err );
        }
    );
};


export default build_AMD;