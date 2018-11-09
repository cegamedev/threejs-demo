var RENDERER, SCENE, CAMERA;
var CONTROLS, CAMERAHELPER, AXESHELPER, STATS;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr, testMeshes = [],
    pre_floor, cur_floor, del_arr = [],
    add_arr = [],LEN_H=32,LEN_F=10;
var memoryWorker,Event1,Event2,EventFg=false;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    _createSky();
}

//创建照相机
function initCamera() {
    let cScale = 15;
    CAMERA = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    CAMERA.position.set(6 * cScale, 5 * cScale, 5 * cScale);

    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);

}

//创建渲染器并将cnavas插入文档
function initRender() {
    RENDERER = new THREE.WebGLRenderer({
        antialias: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.autoClear = false;
    // RENDERER.gammaOutput = true;
    //清除画面颜色
    // RENDERER.setClearColor(0x0080ff);
    document.querySelector(".container").appendChild(RENDERER.domElement);
}

function initLight() {
    var ambientLight = new THREE.AmbientLight(0xffffff); //设置颜色
    SCENE.add(ambientLight);

    var hlight = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    hlight.position.set(0, 1, 0);
    SCENE.add(hlight);

    var pointColor = 0xffffff;
    var directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(6, 6, 6);
    directionalLight.distance = 0;
    directionalLight.intensity = 1;
    SCENE.add(directionalLight);
}

function initContr() {
    CONTROLS = new THREE.OrbitControls(CAMERA);
    CONTROLS.screenSpacePanning = true;
}

function initAxesHelper() {
    AXESHELPER = new THREE.AxesHelper(10)
    SCENE.add(AXESHELPER)
}

function initStats() {
    STATS = new Stats();
    document.querySelector(".container").appendChild(STATS.domElement);
}

//渲染循环
function animate() {

    // cubeGr.rotation.x += 1/180*Math.PI;
    // cubeGr.rotation.y += 1/180*Math.PI;
    CONTROLS.update();
    STATS.update();
    // CAMERA.lookAt(cubeGr.position);

    RENDERER.clear();

    CAMERAHELPER.visible = false;
    RENDERER.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.render(SCENE, CAMERA);


    requestAnimationFrame(animate);
}


function main() {
    
    initScene();
    initCamera();
    initRender();
    initLight();
    initContr();
    initStats();
    initAxesHelper();
    _createModel();
    
    animate();
}

main();

function _createSky() {
    var path = "/assets/images/sunnysky/"; //设置路径
    var format = '.jpg'; //设定格式
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    var textureCube = new THREE.CubeTextureLoader().load(urls);

    SCENE.background = textureCube; //作为背景贴图
}

function _createModel() {
    var loader = new THREE.GLTFLoader();
    var path = '/assets/models/huaxindalou8881_1F_1F/huaxindalou8881_1F_1F.gltf';
    loader.load(path, function (gltf) {
        SCENE.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });
}

