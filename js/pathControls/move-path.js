class MovePath {
    constructor(
        THREE,
        controls,
        target,
        points,
        offsetY = 10,
        speed = 1,
        changeCall,
        endCall
    ) {
        this.THREE = THREE;
        this.controls = controls;
        this.target = target;
        this.points = points;
        this.offsetY = offsetY;
        this.speed = speed;
        this.endCall = endCall;
        this.changeCall = changeCall;

        this.path = [];
        this.pathIndex = 0;
        this.aniId = null;
        this.targetInfo = {
            pos: { ...target.position
            },
            rot: { ...target.rotation
            }
        };
    }
    start() {
        this.pathIndex = 0;
        var curve = new THREE.CatmullRomCurve3(this.points,false,"catmullrom",0.05);
        this.path = curve.getPoints(this.speed);
        _animate.call(this);
    }
    stop() {
        cancelAnimationFrame(this.aniId);
        this.target.position.copy(this.targetInfo.pos);
        this.target.rotation.copy(this.targetInfo.rot);
        if(this.endCall instanceof Function){
            this.endCall();
        }
    }
}

function _animate() {
    var scope = this;
    scope.aniId = requestAnimationFrame(_animate.bind(this));

    if(scope.pathIndex < scope.path.length){
        _change.call(scope);
    }
    else{
        scope.stop();
    }
    
}

function _change(){
    var scope = this;
    scope.target.position.copy(scope.path[scope.pathIndex]);
    scope.target.position.y += scope.offsetY;
    if(scope.target.type == "PerspectiveCamera"){
        var lookObj = new THREE.Vector3();
        if(scope.pathIndex+1 < scope.path.length){
            lookObj.copy(scope.path[scope.pathIndex+1]);
        }
        scope.controls.target.copy(lookObj);
    }

    scope.pathIndex++;
    if(scope.changeCall instanceof Function){
        scope.changeCall(scope.target);
    }
}