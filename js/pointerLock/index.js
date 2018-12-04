var RENDERER, SCENE, CAMERA;
var CONTROLS, CAMERAHELPER, AXESHELPER, STATS, CLOCK;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var cameraThird, cubeGr, testMeshes = [],
    pre_floor, cur_floor, del_arr = [],
    add_arr = [],
    LEN_H = 32,
    LEN_F = 10;
var memoryWorker, Event1, Event2, EventFg = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

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
    CAMERA.position.set(0, 1, 0);
    CAMERA.lookAt(-10,0,0);

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
    // CONTROLS = new THREE.OrbitControls(CAMERA);

    // CONTROLS.minZoom = .15,
    //     CONTROLS.maxZoom = 8,
    //     CONTROLS.autoRotate = !1,
    //     CONTROLS.enableDamping = !0,
    //     CONTROLS.minPolarAngle = 0,
    //     CONTROLS.maxPolarAngle = Math.PI,
    //     CONTROLS.panSpeed = .1,
    //     CONTROLS.rotateSpeed = .07,
    //     CONTROLS.minDistance = 1.5,
    //     CONTROLS.dampingFactor = .12,
    //     CONTROLS.screenSpacePanning = !0,
    //     CONTROLS.enabled = !0,
    //     CONTROLS.pushed = !1;

    // CONTROLS = new THREE.FirstPersonControls(CAMERA);

    // CONTROLS.enabled = true;
    // CONTROLS.lookSpeed = 0.02; //鼠标移动查看的速度
    // CONTROLS.movementSpeed = 10; //相机移动速度
    // CONTROLS.noFly = false;
    // CONTROLS.constrainVertical = true; //约束垂直
    // CONTROLS.verticalMin = 1.0;
    // CONTROLS.verticalMax = 2.0;
    // CONTROLS.lon = 0; //进入初始视角x轴的角度
    // CONTROLS.lat = 0; //初始视角进入后y轴的角度

    CLOCK = new THREE.Clock();



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

    CONTROLS = new THREE.PointerLockControls(CAMERA);
    CONTROLS.getObject().position.y = 0;
    SCENE.add(CONTROLS.getObject());

    var onKeyDown = function (event) {

        switch (event.keyCode) {
            case 87: // w
                moveForward = true;
                break;
            case 65: // a
                moveLeft = true;
                break;
            case 83: // s
                moveBackward = true;
                break;
            case 68: // d
                moveRight = true;
                break;
            case 81: // q
                moveUp = true;
            break;
            case 69: // e
                moveDown = true;
            break;

        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {
            case 87: // w
                moveForward = false;
                break;
            case 65: // a
                moveLeft = false;
                break;
            case 83: // s
                moveBackward = false;
                break;
            case 68: // d
                moveRight = false;
                break;
            case 81: // q
                moveUp = false;
            break;
            case 69: // e
                moveDown = false;
            break;
        }

    };

    

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('click',function(){
        CONTROLS.lock();
    },false);
}

function _updateControls() {
    if (CONTROLS.isLocked === true) {

        var speed = 0.05; 
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.y = Number(moveDown) - Number(moveUp);
        direction.normalize();  
        velocity.z = -direction.z * speed;
        velocity.x = -direction.x  * speed;
        velocity.y = -direction.y * speed;

        if (moveForward || moveBackward){
            CONTROLS.getObject().translateZ(velocity.z);
        }
        if (moveLeft || moveRight){
            CONTROLS.getObject().translateX(velocity.x);
        } 
        if (moveUp || moveDown){
            CONTROLS.getObject().translateY(velocity.y);
        } 

    }
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
    // CONTROLS.update(CLOCK.getDelta());
    STATS.update();
    // CAMERA.lookAt(cubeGr.position);

    RENDERER.clear();

    CAMERAHELPER.visible = false;
    RENDERER.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    RENDERER.render(SCENE, CAMERA);

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

    _updateControls();

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

    var loader = new THREE.GLTFLoader();
    // loader.load('/assets/models/1541758678969/0003826aea654a14a6f393a0aa0db91a/1/default.gltf', function (gltf) {
    //     console.log(gltf);
    //     SCENE.add(gltf.scene);
    // }, undefined, function (e) {
    //     console.error(e);
    // });
    // loader.load('/assets/models/1541758678969/C9FB3F9A29C842F79F02CECC4037FEA1/21/default.gltf', function (gltf) {
    //     console.log(gltf);
    //     SCENE.add(gltf.scene);
    // }, undefined, function (e) {
    //     console.error(e);
    // });
    loader.load('/assets/models/test1/Unity2GLTF.gltf', function (gltf) {
        console.log(gltf);
        SCENE.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/test2/Unity2GLTF.gltf', function (gltf) {
        console.log(gltf);
        gltf.scene.name = "load2";
        SCENE.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/test3/Unity2GLTF.gltf', function (gltf) {
        console.log(gltf);
        gltf.scene.name = "load3";
        SCENE.add(gltf.scene);
    }, undefined, function (e) {
        console.error(e);
    });

    // // floor
    // var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    // floorGeometry.rotateX( - Math.PI / 2 );

    // // vertex displacement

    // var position = floorGeometry.attributes.position;

    // for ( var i = 0, l = position.count; i < l; i ++ ) {

    //     vertex.fromBufferAttribute( position, i );

    //     vertex.x += Math.random() * 20 - 10;
    //     vertex.y += Math.random() * 2;
    //     vertex.z += Math.random() * 20 - 10;

    //     position.setXYZ( i, vertex.x, vertex.y, vertex.z );

    // }

    // floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    // position = floorGeometry.attributes.position;
    // var colors = [];

    // for ( var i = 0, l = position.count; i < l; i ++ ) {

    //     color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    //     colors.push( color.r, color.g, color.b );

    // }

    // floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    // var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    // var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    // SCENE.add( floor );




}