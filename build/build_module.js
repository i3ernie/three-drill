import {rollup}  from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from "./replace.js";

const build_module = function( data, done ){

    rollup({
        input : data.module.input,
        external: data.external,
        
        plugins:[
            nodeResolve()
        ]
    }).then(( bundle ) => { 

        bundle.write({
            file: data.module.output,
            plugins:[
                replace(data.module.replace)
            ],
            
            format: 'es',
            name: 'three',
            exports: 'named',
            sourcemap: true
          });
          done( null, {});
    
        }).catch(
        ( err ) => { 
            done( err, null ); 
        }
    );
};

export default build_module;