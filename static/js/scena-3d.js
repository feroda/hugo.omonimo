// static/js/scena-3d.js

var camera, scene, renderer;
var group = new THREE.Group();
var data = { shape: 1 };

init();

function updateGroupGeometry( mesh, geometry ) {
    if ( geometry.isGeometry ) {
        geometry = new THREE.BufferGeometry().fromGeometry( geometry );
    }
    mesh.children[ 0 ].geometry.dispose();
    mesh.children[ 0 ].geometry = geometry;
}

function init() {
    // Recuperiamo il container di Congo invece di document.body
    var container = document.getElementById('canvas-3d-container');
    if (!container) return;

    // Dimensioni dinamiche basate sul box di Congo
    var width = container.clientWidth;
    var height = container.clientHeight;

    var shapes = [
        new THREE.SphereBufferGeometry(10, 32, 32),
        new THREE.TetrahedronBufferGeometry(20),
        new THREE.BoxBufferGeometry(20, 20, 20)
    ];

    scene = new THREE.Scene();
    // Sfondo grigio come nel tuo sito originale
    scene.background = new THREE.Color( 0x444444 );

    // Camera adattata alle dimensioni del box
    camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 50 );
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    
    // Attacchiamo il canvas al box di Congo
    container.appendChild( renderer.domElement );

    // Configurazione controlli del mouse
    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    // Configurazione Luci originali
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );

    // Caricamento della texture dal nuovo percorso statico di Hugo
    var texture = new THREE.TextureLoader().load('/assets/textures/io.jpg');
    var meshMaterial = new THREE.MeshPhongMaterial( { 
        color: 0x156289, 
        emissive: 0x072534, 
        side: THREE.DoubleSide, 
        flatShading: true, 
        map: texture 
    } );

    group.add( new THREE.Mesh( geometry, meshMaterial) );
    scene.add( group );
    
    updateGroupGeometry(group, shapes[0]);

    // Ciclo di animazione e rotazione
    var render = function () {
        requestAnimationFrame( render );
        group.rotation.x += 0.005;
        group.rotation.y += 0.005;
        renderer.render( scene, camera );
    };

    // Gestione del ridimensionamento della finestra (Responsivo)
    window.addEventListener( 'resize', function () {
        var newWidth = container.clientWidth;
        var newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( newWidth, newHeight );
    }, false );

    render();

    // Timer per cambiare forma ogni 3 secondi (Logica originale)
    function generateGeometry (i) {
        updateGroupGeometry(group, shapes[i]);
    };
    
    var i = 0;
    setInterval(function () {
        generateGeometry(i % 3); 
        i += 1;
    }, 3000);
}
