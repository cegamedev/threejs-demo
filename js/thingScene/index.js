var RENDERER, SCENE, CAMERA;
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
        setTimeout(()=>{
            gltf.scene.visible = false;
            setTimeout(() => {
                gltf.scene.visible = true;
            }, 1000);
        },1000);
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

    console.log(SCENE);

    setTimeout(() => {
        var load3 = SCENE.getObjectByName("load3");
        console.log(load3)
        // load3.material=new THREE.MeshBasicMaterial({color: 0xff0000});
        // load3.material.color.set("#ff0000");
        load3.traverse(function (item) {
            if (item instanceof THREE.Mesh) {
                // item.geometry.dispose(); //删除几何体
                // item.material.dispose(); //删除材质
                // item.material.map.dispose();
                item.material.forEach((m) => {
                    m.color.set("#ff0000");
                });

                console.log(item);

                //         edges = new THREE.EdgesHelper( item, 0x1535f7 );
                // SCENE.add(edges);

                // let cubeEdges = new THREE.EdgesGeometry(item.geometry, 1);
                // let edgesMtl = new THREE.LineBasicMaterial({
                //     color: 0x0000ff
                // });
                // edgesMtl.depthTest = false; //深度测试，若开启则是边框透明的效果
                // let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
                // SCENE.add(cubeLine);

            }
        });

        setTimeout(() => {
            self._aniAction(load3);
            setTimeout(() => {
                self._aniAction2(CAMERA);
            }, 2000);
        }, 2000);




    }, 2000);




}

function _aniAction(obj) {
    console.log("ani--> ", obj);
    let tween = new TimelineMax()
    tween.to(obj.scale, 1, { // 从 1 缩放至 2，花费 1 秒
            x: 2,
            y: 2,
            z: 2,
            ease: Power0.easeInOut, // 速度曲线
            onStart: function () { // 监听动画开始 
            },
            onUpdate: function () { // 监听动画过程 
            },
            onComplete: function () { // 监听动画结束
            }
        })
        .to(obj.position, 1, { // 缩放结束后，位移 x 至 10，花费 1 秒
            x: 10,
            y: 0,
            z: 0
        })
    tween.to(obj.rotation, 0.7, { // 从 1 缩放至 2，花费 1 秒
        y: -Math.PI,
        ease: Expo.easeOut
    });
}

function _aniAction2(obj) {
    console.log("ani--> ", obj);
    let tween = new TimelineMax()
    tween.to(obj.rotation, 1, { // 从 1 缩放至 2，花费 1 秒
        x: -2.8518785861820892,
        y: -0.17597279681605066,
        z: -3.0894525332096032,
    });
    tween.to(obj.position, 1, { // 缩放结束后，位移 x 至 10，花费 1 秒
        x: -17.962486849103726,
        y: 23.99108493490684,
        z: -79.48105227178657
    })

}