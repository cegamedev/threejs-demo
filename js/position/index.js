var RENDERER, SCENE, CAMERA, LIGTH;
var CONTROLS, CAMERAHELPER, AXESHELPER;
var CWIDTH = 800,
    CHEIGHT = 500,
    PWIDTH = 1920,
    PHEIGHT = 1080;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    SCENE.background = new THREE.Color(0xf0f0f0);
}

//创建照相机
function initCamera() {
    CAMERA = new THREE.PerspectiveCamera(45, PWIDTH / PHEIGHT, 0.1, 1000);
    CAMERA.position.set(-1.73475, -6.31056, 3.91831);
    // CAMERA.rotation.set(de2th(63), de2th(0), de2th(31));
    var quaternion = new THREE.Quaternion(0.361689,-0.145948,-0.344567,0.853905);
    // var quaternion = new THREE.Quaternion();
    // var eu = new THREE.Euler( de2th(45.9122), de2th(0), de2th(-43.95), 'ZYX' );
    // quaternion.setFromEuler(eu);
    CAMERA.applyQuaternion( quaternion );
}

//创建渲染器并将cnavas插入文档
function initRender() {
    RENDERER = new THREE.WebGLRenderer({
        antialias: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(CWIDTH, CHEIGHT);
    RENDERER.gammaOutput = true;
    //清除画面颜色
    RENDERER.setClearColor(0x000000);
    document.querySelector(".container").appendChild(RENDERER.domElement);
}

function initLight() {
    LIGTH = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    LIGTH.position.set(0, 1, 0);
    SCENE.add(LIGTH);
}

function initControl() {
    CONTROLS = new THREE.OrbitControls(CAMERA);
}

function initCameraHelper() {
    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);
}

function initAxesHelper() {
    AXESHELPER = new THREE.AxesHelper(10)
    SCENE.add(AXESHELPER)
}

//渲染循环
function animate() {
    requestAnimationFrame(animate);
    RENDERER.render(SCENE, CAMERA);
}

//自适应窗口大小
function onResize() {
    // 设置透视摄像机的长宽比
    CAMERA.aspect = PWIDTH / PHEIGHT
    // 摄像机的 position 和 target 是自动更新的，而 fov、aspect、near、far 的修改则需要重新计算投影矩阵（projection matrix）
    CAMERA.updateProjectionMatrix()
    // 设置渲染器输出的 canvas 的大小
    RENDERER.setSize(CWIDTH, CHEIGHT)
}

function main() {
    initScene();
    initCamera();
    initRender();
    initLight();
    // initControl();
    initCameraHelper();
    initAxesHelper();
    _createModel();
    _getCameraPosition();
    animate();
    // window.addEventListener('resize', onResize, false);
}

main();

function _createModel() {
    var loader = new THREE.GLTFLoader();
    loader.load('/assets/models/test.gltf', function (gltf) {
        console.log(gltf);
        SCENE.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });
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
    SCENE.add(cubeX);
    SCENE.add(cubeY);
    SCENE.add(cubeZ);
}

function _getCameraPosition() {
    document.querySelector(".demo-btn").addEventListener('click', () => {
        console.log("camera position >", CAMERA.position);
        console.log("camera rotation >", CAMERA.rotation);
    });
}