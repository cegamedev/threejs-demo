var RENDERER, SCENE, CAMERA, LIGTH;
var CONTROLS, CAMERAHELPER, AXESHELPER;

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    SCENE.background = 'rgba(0,0,0, 0)';
}

//创建照相机
function initCamera() {
    

    cameraThird = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
    cameraThird.position.z = 20;

    CAMERA = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 1000);
    CAMERA.position.z = 5;

    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);

    CONTROLS = new THREE.OrbitControls(CAMERA);
}

//创建渲染器并将cnavas插入文档
function initRender() {
    RENDERER = new THREE.WebGLRenderer({
        antialias: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    RENDERER.autoClear = false;
    // RENDERER.gammaOutput = true;
    //清除画面颜色
    // RENDERER.setClearColor(0x0080ff);
    document.querySelector(".container").appendChild(RENDERER.domElement);
}

function initLight() {
    LIGTH = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    LIGTH.position.set(0, 1, 0);
    SCENE.add(LIGTH);
}

function initAxesHelper() {
    AXESHELPER = new THREE.AxesHelper(10)
    SCENE.add(AXESHELPER)
}

//渲染循环
function animate() {

    cubeGr.rotation.x += 1/180*Math.PI;
    cubeGr.rotation.y += 1/180*Math.PI;
    
    CAMERA.lookAt(cubeGr.position);

    RENDERER.clear();
    
    RENDERER.setViewport( 0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    RENDERER.render(SCENE, CAMERA);
    
    RENDERER.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    RENDERER.render(SCENE, cameraThird);

    requestAnimationFrame(animate);
}


function main() {
    initScene();
    initCamera();
    initRender();
    initLight();
    initAxesHelper();
    _createModel();
    animate();
}

main();

function _createModel() {
    var redM = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    var greenM = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var blueM = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    var box = new THREE.CubeGeometry(1, 1, 1);

    var cubeX = new THREE.Mesh(box, redM);
    cubeX.position.set(1.5, 0, 0);
    var cubeY = new THREE.Mesh(box, greenM);
    cubeY.position.set(0, 1.5, 0);
    var cubeZ = new THREE.Mesh(box, blueM);
    cubeZ.position.set(0, 0, -1.5);
    cubeGr = new THREE.Group();
    cubeGr.add(cubeX);
    cubeGr.add(cubeY);
    cubeGr.add(cubeZ);
    var loader = new THREE.GLTFLoader();
    loader.load('/assets/models/test.gltf', function (gltf) {
        cubeGr.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });
    SCENE.add(cubeGr);
}