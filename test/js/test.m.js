
import * as pack from 'Playground';


const THREE = pack.THREE;
const VP = new pack.Playground().VP;
const gui = new pack.GUI();



const params = {
    width : 60,
    height : 60
};

console.log(pack);

VP.camera.position.z = 500;

VP.scene.background = new THREE.Color( 0xcccccc );

// add a ambient light
VP.scene.add( new THREE.AmbientLight( 0x020202 ) );

// add a light in front
let light	= new THREE.DirectionalLight('white', 2);
light.position.set(100, 100, 300);
VP.scene.add( light );




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




const box = new THREE.Mesh( new THREE.BoxGeometry(100, 100, 100), mat);
box.position.set(0, 50, 0);
box.rotation.set(0, Math.PI/4, 0);

const box2 = new THREE.Mesh( new THREE.BoxGeometry(105, 20, 100), mat3);
box2.position.set(0, 60, 0);
box2.rotation.set(0, Math.PI/5, 0);

const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry( 30, 30, 120, 64,64), mat2);
cyl1.position.set(10, 40, 40);

box.add( box2 );
box2.add( cyl1 );
cyl1.add( new THREE.Object3D() );

//const testMesh = new THREE.Mesh( cyl1.geometry.clone());
//testMesh.position.copy( cyl1.getWorldPosition() );
//testMesh.quaternion.copy( cyl1.getWorldQuaternion() );
//VP.scene.add(testMesh);

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
const cBox2 = box2.clone();
const cCyl1 = cyl1.clone();

const obj1 = new THREE.Object3D();
obj1.position.set(-300, 0, 0);

const trans = new THREE.Object3D();
//trans.position.copy( box.position );
//trans.rotation.y += box.rotation.y; 

trans.add( driller.clone(), driller2.clone(), driller3.clone() );

cBox.add( cBox2 );
cBox2.add( cCyl1 );
obj1.add( cBox );




 


obj1.add( trans );



VP.scene.add( obj1 );
VP.scene.add( box );

// render loop for your animations etc
VP.loop.add( function( delta, now ) {

    
});

console.log( THREE.REVISION );
