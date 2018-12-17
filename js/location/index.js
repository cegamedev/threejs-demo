var RENDERER, SCENE, CAMERA, css2dRender, css3dRender;
var CONTROLS, CAMERAHELPER, AXESHELPER, STATS;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr, testMeshes = [],
    pre_floor, cur_floor, del_arr = [],
    add_arr = [],
    LEN_H = 32,
    LEN_F = 10;
var memoryWorker, Event1, Event2, EventFg = false;

//创建场景
function initScene() {
    SCENE = new THREE.Scene();
    _createSky();
}

//创建照相机
function initCamera() {
    let cScale = 15;
    CAMERA = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    // CAMERA.position.set(6 * cScale, 5 * cScale, 5 * cScale);
    CAMERA.position.set(9.763, 63.185, 4.795);

    CAMERAHELPER = new THREE.CameraHelper(CAMERA);
    SCENE.add(CAMERAHELPER);

}

//创建渲染器并将cnavas插入文档
function initRender() {
    RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.autoClear = false;
    RENDERER.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // RENDERER.gammaOutput = true;
    //清除画面颜色
    // RENDERER.setClearColor(0x0080ff);

    RENDERER.setClearColor(0x000000, 0); // required
    RENDERER.domElement.style.position = 'absolute'; // required
    RENDERER.domElement.style.top = 0;
    RENDERER.domElement.style.left = 0;
    RENDERER.domElement.style.zIndex = "1"; // required
    document.querySelector(".container").appendChild(RENDERER.domElement);


    css2dRender = new THREE.CSS2DRenderer();
    css2dRender.setSize(window.innerWidth, window.innerHeight);
    css2dRender.domElement.style.position = 'absolute';
    css2dRender.domElement.style.top = 0;
    document.querySelector(".container").appendChild(css2dRender.domElement);

    css3dRender = new THREE.CSS3DRenderer();
    css3dRender.setSize(window.innerWidth, window.innerHeight);
    css3dRender.domElement.style.position = 'absolute';
    css3dRender.domElement.style.top = 0;
    document.querySelector(".container").appendChild(css3dRender.domElement);


    //h到d的位移旋转缩放映射
    // h.updateMatrixWorld();
    //     var t = h.matrixWorld
    //       , r = new THREE.Vector3
    //       , i = new THREE.Vector3 
    //       , n = new THREE.Quaternion;
    //     t.decompose(r, n, i),
    //     d.quaternion.copy(n),
    //     d.position.copy(r).multiplyScalar(e.cssFactor);
    //     var o = u / (h.geometry.parameters.width * i.x);
    //     d.scale.set(1, 1, 1).multiplyScalar(e.cssFactor / o)
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
    CONTROLS = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

    CONTROLS.minZoom = .15,
        CONTROLS.maxZoom = 8,
        CONTROLS.autoRotate = !1,
        CONTROLS.enableDamping = !0,
        CONTROLS.minPolarAngle = 0,
        CONTROLS.maxPolarAngle = Math.PI,
        CONTROLS.panSpeed = .1,
        CONTROLS.rotateSpeed = .07,
        CONTROLS.minDistance = 1.5,
        CONTROLS.dampingFactor = .12,
        CONTROLS.screenSpacePanning = !0,
        CONTROLS.enabled = !0,
        CONTROLS.pushed = !1;
    // var t = this;
    // e.addEventListener("start", function () {
    //         t.onStart()
    //     }),
    //     e.addEventListener("end", function () {
    //         t.onEnd()
    //     }),
    //     e.addEventListener("wheel", function () {
    //         t.onWheel()
    //     }),
    //     e.addEventListener("change", function (e) {
    //         t.onChange(e)
    //     })
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

    RENDERER.render(SCENE, CAMERA);

    // css2dRender.render(SCENE, CAMERA);
    // css3dRender.render(SCENE, CAMERA);

    // CAMERAHELPER.visible = true;
    // RENDERER.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    // RENDERER.render(SCENE, cameraThird);

    // var dd = _getFDistance();
    // console.log(dd);

    if (EventFg) {
        document.dispatchEvent(Event1);
        document.dispatchEvent(Event2);
    }

    // _wkPostMessage();

    requestAnimationFrame(animate);
}

// setInterval(animate, 1000 / 60);


function main() {
    _initEvent();
    // initWorker();
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

function _initEvent() {
    document.querySelector(".demo-btn").addEventListener("click", function () {
        console.log(CAMERA.position, CAMERA.rotation);
    });
}

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

    var self = this;

    var gltfobj1 = null;
    var loader = new THREE.GLTFLoader();
    

    var wEvent = new WEvent(THREE, SCENE, CAMERA);
    var wLocation = new WLocation(THREE, CAMERA);

    var geometryP1 = new THREE.SphereGeometry(1, 16, 16);
    var materialP1 = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });

    var circleP1 = new THREE.Mesh(geometryP1, materialP1);
    circleP1.name = "circleP1";
    // circleP1.position.set(1, 1, 1);
    SCENE.add(circleP1);

    loader.load('/assets/models/test1/Unity2GLTF.gltf', function (gltf) {
        gltfobj1 = gltf.scene;
        gltfobj1.name = "garden";
        gltfobj1.position.set(4, 1, 1);
        circleP1.add(gltfobj1);
    }, undefined, function (e) {
        console.error(e);
    });

    var demobtn = document.querySelector(".demo-btn");

    setTimeout(() => {



        wEvent.debug((data) => {
            console.log("click debug->", data);
            var point = new THREE.Vector3();
            point.copy(data.point);
            console.log("click location position:", point);
            var wordPoint = wLocation.location2World(gltfobj1, point);
            console.log("world position:", wordPoint);
            var localPoint = wLocation.world2Location(gltfobj1, wordPoint);
            console.log("garden location position:", localPoint);
            var localPoint2 = wLocation.world2Location(circleP1, wordPoint);
            console.log("circleP1 location position:", localPoint2);
            var screenPoint = wLocation.world2Screen(wordPoint);
            console.log("screen position:", screenPoint);
            demobtn.style.left = screenPoint.x + "px";
            demobtn.style.top = screenPoint.y + "px";
        });
    }, 1000);


    var circleP2 = new THREE.Mesh(geometryP1, materialP1);
    circleP2.name = "circleP2";
    circleP2.position.set(0, 0, 0);
    SCENE.add(circleP2);

    document.addEventListener("click", function (e) {
        var eX = e.clientX;
        var eY = e.clientY;
        var wordPoint = wLocation.screen2World(eX, eY);

        wordPoint.sub(CAMERA.position).normalize();
        //将射线延伸到原点
        var distance = -CAMERA.position.z / wordPoint.z;
        var pos = new THREE.Vector3();
        pos.copy(CAMERA.position).add(wordPoint.multiplyScalar(distance));

        circleP2.position.copy(pos);
    });




    console.log(SCENE);

}