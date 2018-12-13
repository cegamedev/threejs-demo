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
        SCENE.add(gltf.scene);
        console.log(gltf);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/test2/Unity2GLTF.gltf', function (gltf) {

        gltf.scene.name = "load2";
        SCENE.add(gltf.scene);
        setTimeout(() => {
            gltf.scene.visible = false;
            setTimeout(() => {
                gltf.scene.visible = true;
            }, 1000);
        }, 1000);
        console.log(gltf);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/test3/Unity2GLTF.gltf', function (gltf) {
        gltf.scene.name = "sofa";
        SCENE.add(gltf.scene);
        console.log(gltf);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/testpath2/Unity2GLTF.gltf', function (gltf) {
        gltf.scene.name = "load4";
        SCENE.add(gltf.scene);
        console.log(gltf);
    }, undefined, function (e) {
        console.error(e);
    });

    loader.load('/assets/models/curve.gltf', function (gltf) {
        gltf.scene.name = "load5";
        SCENE.add(gltf.scene);
        var curve = gltf.scene.getObjectByName("贝塞尔曲");
        console.log(curve);
        console.log(gltf);
    }, undefined, function (e) {
        console.error(e);
    });

    var geometryP = new THREE.SphereGeometry(1, 16, 16);
    var materialP = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    var circleP = new THREE.Mesh(geometryP, materialP);
    SCENE.add(circleP);

    // var pointArr = [
    //     new THREE.Vector3(-2, 0, 10),
    //     new THREE.Vector3(-10, 10, 10),
    //     new THREE.Vector3(-5, 5, 5),
    //     new THREE.Vector3(0, 0, 0),
    //     new THREE.Vector3(5, -5, 5),
    //     new THREE.Vector3(10, 0, 10)
    // ];
    // var curve = new THREE.CatmullRomCurve3(pointArr);
    // var geometry = new THREE.Geometry();
    // geometry.vertices = curve.getPoints(50);
    // var material = new THREE.LineBasicMaterial({
    //     color: 0x00ff00,
    // });
    // var line = new THREE.Line(geometry, material);
    // SCENE.add(line);

    // //sprite
    // // var sp = document.createElement("div");
    // // sp.style.backgroundColor = "#00ff00";
    // // sp.textContent = "hello";
    // // sp.style.width = "20rem";
    // // sp.style.height = "20rem";
    // // var object = new THREE.CSS3DSprite(sp);

    // var earthDiv = document.createElement('div');
    // earthDiv.className = 'label';
    // earthDiv.style.backgroundColor = "#00ff00";
    // earthDiv.style.width = "10px";
    // earthDiv.style.height = "10px";
    // for (var i = 0; i < pointArr.length; i++) {
    //     // var object = new THREE.CSS2DObject(earthDiv.cloneNode(true));
    //     // var object = new THREE.CSS3DObject(earthDiv.cloneNode(true));
    //     var object = createSpriteShape(2);
    //     var pos = pointArr[i];
    //     object.position.set(pos.x,pos.y,pos.z);
    //     SCENE.add(object);
    // }

    var pointArr = [
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(15, 0, 0),
        new THREE.Vector3(20, 0, 0),
        new THREE.Vector3(20, 10, 0),
        new THREE.Vector3(15, 10, 0),
        new THREE.Vector3(10, 10, 0)
    ];

    // var curve = new THREE.CatmullRomCurve3(pointArr,false,"catmullrom",0.05);
    // var geometry = new THREE.Geometry();
    // geometry.vertices = curve.getPoints(60);
    // var material = new THREE.LineBasicMaterial({
    //     color: 0x00ff00,
    // });
    // var line = new THREE.Line(geometry, material);
    // SCENE.add(line);

    var lineMap = [
        [0, 1, 0, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [1, 0, 1, 0, 1, 0],
        [1, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 1, 0]
    ];
    var topology = new Topology(THREE, SCENE);
    topology.debug = true;
    // topology.showByVectors(pointArr);
    topology.create(pointArr, lineMap);
    topology.show(true);

    setTimeout(() => {
        var roadList = topology.findShortPath(pointArr[0], pointArr[5]);
        console.log(roadList);
        var vectors = [];
        roadList.forEach((data) => {
            vectors.push(pointArr[data]);
        });
        
        var movePath = new MovePath(THREE, CONTROLS, circleP, vectors, 0, 300, (data) => {}, (data) => {
            CONTROLS.enabled = false;
            var firstMove = new MovePath(THREE, CONTROLS, CAMERA, vectors, 0, 300,()=>{},()=>{
                CONTROLS.enabled = true;
            });
            firstMove.start();
        });
        movePath.start();
    }, 5000);


    console.log(SCENE);
}

function createSpriteShape(w) {
    /*1、创建一个画布，记得设置画布的宽高，否则将使用默认宽高，有可能会导致图像显示变形*/
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = w;
    /*2、创建图形，这部分可以去看w3c canvas教程*/
    let ctx = canvas.getContext("2d");
    ctx.rect(0, 0, w, w);
    ctx.fillStyle = "#0000ff";
    ctx.fill();
    /*3、将canvas作为纹理，创建Sprite*/
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true; //注意这句不能少
    let material = new THREE.SpriteMaterial({
        map: texture
    });
    let mesh = new THREE.Sprite(material);
    /*4、放大图片，每个精灵有自己的大小，默认情况下都是很小的，如果你不放大，基本是看不到的*/
    mesh.scale.set(0.25, 0.25, 1);
    return mesh;
}