class Topology {
    constructor(THREE, scene, dotWith=2) {
        this.vectors = []; //顶点集合
        this.weightMap = [
            []
        ]; //边集合，二维数组，值代表权值

        this.THREE = THREE;
        this.scene = scene;
        this.dotWith = dotWith;
        this.topology = new THREE.Group();
        this.topology.name = "topology";
        this.topologyDot = new THREE.Group();
        this.topologyDot.name = "topologyDot";
        this.debug = true;
    }
    create(vectors, lineMap) {
        this.vectors = vectors;
        this.weightMap = _line2Weight.call(this, vectors, lineMap);
    }
    show(showPoint = true) {
        var scope = this;
        for(let i=0;i<scope.weightMap.length;i++){
            var row = scope.weightMap[i];
            for(let j=i;j<row.length;j++){
                if(row[j]>0){
                    var startP = scope.vectors[i];
                    var endP = scope.vectors[j];
                    scope.showByVectors([startP,endP],showPoint,i,j);
                }
            }
        }
    }
    showByVectors(vectors,showPoint = true,startI=0,startJ=0) {
        var scope = this;
        if(vectors.length<2){
            return;
        }
        scope.topology = new THREE.Group();
        scope.topology.name = "topology";
        scope.topologyDot = new THREE.Group();
        scope.topologyDot.name = "topologyDot";

        var geometry = new scope.THREE.Geometry();
        geometry.vertices = vectors;
        var material = new scope.THREE.LineBasicMaterial({
            color: 0x00ff00,
        });
        var line = new scope.THREE.Line(geometry, material);
        scope.topology.add(line);
        scope.scene.add(scope.topology);

        if(showPoint){
            for(let i=0;i<vectors.length;i++){
                var dot = null;
                if(scope.debug){
                    var txt = (startJ && i>0)?startJ:startI+i;
                    dot = _createSpriteText.call(scope,txt);
                }
                else{
                    dot = _createSpriteShape.call(scope,scope.dotWith);
                }
                dot.position.copy(vectors[i]);
                scope.topologyDot.add(dot);
            }
            scope.scene.add(scope.topologyDot);
        }
    }
    findShortPath(p1, p2, delY) {
        var scope = this;
        var startP = p1;
        var endP = p2;
        startP.y = startP.y +delY;
        endP = endP.y + delY;
        //映射到路径上
        var startI = 0;
        var endI = 0;
        for(let i=0;i<scope.vectors.length;i++){
            var startMin = scope.vectors[startI];
            var endMin = scope.vectors[endI];
            var startDisMin = _distance3d(startP,startMin);
            var endDisMin = _distance3d(endP,endMin);
            if(_distance3d(startP,scope.vectors[i]) < startDisMin){
                startI = i;
            }
            if(_distance3d(endP,scope.vectors[i]) < endDisMin){
                endI = i;
            }
        }
        if(startI == endI){
            return;
        }
        //查找所有路径
        var roadList = [];
        
    }
}

function _line2Weight(vectors, lineMap) {
    var weightMap = [];
    for (let i = 0; i < lineMap.length; i++) {
        var row = lineMap[i];
        var weightRow = [];
        for (let j = 0; j < row.length; j++) {
            if (row[j] > 0) {
                var p1 = vectors[i];
                var p2 = vectors[j];
                var distance = _distance3d.call(this, p1, p2);
                weightRow.push(distance);
            } else {
                weightRow.push(0);
            }
        }
        weightMap.push(weightRow);
    }
    return weightMap;
}

function _distance3d(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2) + Math.pow((p2.z - p1.z), 2));
}

function _distance2d(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.z - p1.z), 2));
}

function _createSpriteShape(w) {
    let scope = this;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = w;
    let ctx = canvas.getContext("2d");
    ctx.rect(0, 0, w, w);
    ctx.fillStyle = "#0000ff";
    ctx.fill();
    let texture = new scope.THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new scope.THREE.SpriteMaterial({
        map: texture
    });
    let mesh = new scope.THREE.Sprite(material);
    mesh.scale.set(0.25, 0.25, 1);
    return mesh;
}

function _createSpriteText(text,s=1) {
    let scope = this;
    let canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ff0000";
    ctx.font = "Bold 18px Arial";
    ctx.fillText(text,10,20);
    let texture = new scope.THREE.Texture(canvas);
    texture.needsUpdate = true;
    let material = new scope.THREE.SpriteMaterial({
        map: texture
    });
    let mesh = new scope.THREE.Sprite(material);
    mesh.scale.set(3*s, 3*s, 1);
    return mesh;
}