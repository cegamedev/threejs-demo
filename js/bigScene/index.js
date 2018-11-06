var RENDERER, SCENE, CAMERA;
var CONTROLS, CAMERAHELPER, AXESHELPER, STATS;

    var SCREEN_WIDTH = 1920/2;
    var SCREEN_HEIGHT = 1080/2;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    _createSky();
}

//创建照相机
function initCamera() {
    let cScale = 15;
    CAMERA = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    CAMERA.position.set(6*cScale,5*cScale,5*cScale);

    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);
    
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
    var ambientLight = new THREE.AmbientLight(0xffffff);//设置颜色
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

function initContr(){
    CONTROLS = new THREE.OrbitControls(CAMERA);
    CONTROLS.screenSpacePanning = true;
}

function initAxesHelper() {
    AXESHELPER = new THREE.AxesHelper(10)
    SCENE.add(AXESHELPER)
}

function initStats(){
    STATS = new Stats();
    document.querySelector(".container").appendChild( STATS.dom );
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
    RENDERER.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
    RENDERER.render(SCENE, CAMERA);
    
    // CAMERAHELPER.visible = true;
    // RENDERER.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    // RENDERER.render(SCENE, cameraThird);

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
    _getCameraPosition();
    animate();
}

main();

function _createSky(){
    var path = "/assets/images/sunnysky/";       //设置路径
        var format = '.jpg';                        //设定格式
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        var textureCube = new THREE.CubeTextureLoader().load( urls );

        SCENE.background = textureCube; //作为背景贴图
}

function _createModel() {
    cubeGr = new THREE.Group();
    SCENE.add(cubeGr);
    let k = 0,z=0;
    for(let j=0;j<50;j++){
        var homeGr = new THREE.Group();
        for(let i=0;i<10;i++){
            var floorGr = _createFloor(8*i);
            homeGr.add(floorGr);
            console.log(i);
        }
        homeGr.scale.set(0.5,0.5,0.5);
        homeGr.position.set(30*k-90,0,z*20-140);
        if(j%9==0){
            k++;
            z=0;
        }
        z++;
        
        cubeGr.add(homeGr);
    }
    
    
}

function _createFloor(height) {
    
    var floorGr = new THREE.Group();

    var loader = new THREE.GLTFLoader();
    var path = '/assets/models/turn0_1/default.gltf';
    loader.load(path, function (gltf) {
        floorGr.add(gltf.scene);
    }, undefined, function (e) { 
        console.error(e);
    });
    
    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn1_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.5,0.5,0.5);
    //     for(let j=0;j<7;j++){
    //         for(let i=0;i<52;i++){
    //             let tempSofa = gltf.scene.clone();
    //             tempSofa.position.set((-17 + i/1.5),0,-6+j*2);
    //             floorGr.add(tempSofa);
    //         }
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn2_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.2,0.2,0.2);
    //     for(let i=0;i<4;i++){
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-15 + i*2),1,-2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn3_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.5,0.5,0.5);
    //     for(let i=0;i<4;i++){
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-7 + i*2),1,-2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn4_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.2,0.2,0.2);
    //     for(let i=0;i<4;i++){
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((1 + i*2),1,-2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn5_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(0.5,0.5,0.5);
    //     for(let i=0;i<4;i++){
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((9 + i*2),1,-2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    // var loader = new THREE.GLTFLoader();
    // var path = '/assets/models/turn6_1/default.gltf';
    // loader.load(path, function (gltf) {
    //     gltf.scene.scale.set(60,60,60);
    //     for(let i=0;i<16;i++){
    //         let tempSofa = gltf.scene.clone();
    //         tempSofa.position.set((-15 + i*2),1,2);
    //         floorGr.add(tempSofa);
    //     }
    // }, undefined, function (e) {
    //     console.error(e);
    // });

    floorGr.position.y = height;

    return floorGr;
}

function _getCameraPosition() {
    document.querySelector(".demo-btn").addEventListener('click', () => {
        console.log("camera position >", CAMERA.position);
        console.log("camera rotation >", CAMERA.rotation);
    });
}