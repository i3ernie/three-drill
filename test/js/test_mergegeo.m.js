
import * as pack from '../../node_modules/onpla_playground/dist/playground.m.js';
import {Driller} from '../../src/pack.module.js'
import  * as BufferGeometryUtils from 'BufferGeometryUtils';
import {CornerCorpusGeometry} from './CornerCorpusGeometry.module.js'

const THREE = pack.THREE;
const VP = new pack.Playground().VP;
const gui = new pack.GUI();


const params = {
    width : 60,
    height : 60
};


VP.camera.position.z = 500;

VP.scene.background = new THREE.Color( 0xcccccc );

// add a ambient light
VP.scene.add( new THREE.AmbientLight( 0x020202 ) );

// add a light in front
let light	= new THREE.DirectionalLight('white', 2);
light.position.set(100, 100, 300);
VP.scene.add( light );

const myDriller = new Driller();


const loader = new THREE.TextureLoader();
const texture = loader.load( 'textures/crate.gif' );
let mat = new THREE.MeshBasicMaterial( { 
    map: texture 
});
const texture2 = loader.load( 'textures/uv_grid_opengl.jpg' );
let mat2 = new THREE.MeshBasicMaterial( { 
    map: texture2 
});
const texture3 = loader.load( 'textures/FloorsCheckerboard_S_Diffuse.jpg' );
let mat3 = new THREE.MeshBasicMaterial( { 
    map: texture3 
});

const geo1 = new THREE.BoxGeometry(50, 100, 50);
const geo2 = new THREE.BoxGeometry(100, 10, 100);
const geo = new CornerCorpusGeometry({width:90, width2:90, height:72 });
//BufferGeometryUtils.mergeBufferGeometries( [ geo1, geo2], true );

const box = new THREE.Mesh( geo, mat);
box.position.set(0, 50, 0);
box.rotation.set(0, Math.PI/4, 0);



//Bohrer definieren
const driller = new THREE.Mesh( new THREE.BoxGeometry(25, 400, 25), new THREE.MeshBasicMaterial({color:"red"}));
driller.rotation.set( 0, 0, -Math.PI/5.5 );

const driller2 = new THREE.Mesh( new THREE.CylinderGeometry(20, 20, 200, 64, 64), new THREE.MeshBasicMaterial({color:"blue"}));
driller2.rotation.set( Math.PI/2, 0, 0 );
driller2.position.set(0, 40, 0);

const driller3 = new THREE.Mesh( new THREE.SphereGeometry(30, 32, 32), new THREE.MeshBasicMaterial({color:"blue"}));
driller3.position.set(-50, 10, 0);




//copy for debug 
const cBox = box.clone();


const obj1 = new THREE.Object3D();
obj1.position.set(-300, 0, 0);

const trans = new THREE.Object3D();
//trans.position.copy( box.position );
//trans.rotation.y += box.rotation.y; 

trans.add( driller.clone(), driller2.clone(), driller3.clone() );

obj1.add( cBox );


//jetzt wird gebohrt
myDriller.setDriller( driller ).drill( box, {translation:true} );
myDriller.setDriller( driller2 ).drill( box, {translation:true} );
myDriller.setDriller( driller3 ).drill( box, {translation:true} );

 


obj1.add( trans );



VP.scene.add( obj1 );
VP.scene.add( box );

// render loop for your animations etc
VP.loop.add( function( delta, now ) {
  
    
});

