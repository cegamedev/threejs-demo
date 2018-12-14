class CallBackEvent{
    constructor(wEventType,mesh){
        this.type = wEventType;
        this.mesh = mesh;
    }
}

class Callclick {
    constructor() {}
    static runCallBack(event) {
        event.preventDefault();
        var scope = this;
        var wEventType = event.type;

        scope.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        scope.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (scope.eventTargets[wEventType] && scope.eventTargets[wEventType].length > 0) {
            rayCastPicker.call(scope, wEventType);
        }
    }
}

class Callmousemove {
    constructor() {}
    static runCallBack(event) {
        event.preventDefault();
        var scope = this;
        var wEventType = event.type;

        scope.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        scope.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (scope.eventTargets[wEventType] && scope.eventTargets[wEventType].length > 0) {
            rayCastPicker.call(scope, wEventType);
        }

    }
}

class WEvent {
    constructor(THREE, scene, camera) {
        this.THREE = THREE;
        this.scene = scene;
        this.camera = camera;
        this.eventMap = {
            click: "click",
            mousemove: "mousemove"
        };
        // this.eventTargets = {
        //     "click":[
        //         {
        //             target:"",
        //             callBack:""
        //         }
        //     ]
        // };
        this.eventTargets = {};
        this.mouse = new this.THREE.Vector2();
        initWindowEvent.call(this);
        // _animate.call(this);
    }

    on(eventType, targets, callBack) {
        if (!this.eventMap[eventType]) {
            return;
        }
        addEventTargets.call(this, this.eventMap[eventType], targets, callBack);
    }

    off(eventType, targets) {
        if (!this.eventMap[eventType]) {
            return;
        }
        removeEventTargets.call(this, this.eventMap[eventType], targets);
    }

}

function initWindowEvent() {
    var scope = this;
    for (let i in scope.eventMap) {
        var wEventType = scope.eventMap[i];
        document.addEventListener(wEventType, winCallBack.bind(scope));
    }
}

function winCallBack(event) {
    var scope = this;
    var callBackClass = eval(`Call${event.type}`);
    callBackClass.runCallBack.call(scope, event);
}



function addEventTargets(wEventType, targets, callBack) {
    var scope = this;
    var curTargets = scope.eventTargets[wEventType];
    if (curTargets) {
        for (let i = 0; i < targets.length; i++) {
            var tg = targets[i];
            var isContentTg = false;
            for (let j = 0; j < curTargets.length; j++) {
                if (curTargets[j].target == tg) {
                    isContentTg = true;
                    break;
                }
            }
            if (!isContentTg) {
                var tagItem = {
                    target: tg,
                    callBack: callBack
                };
                curTargets.push(tagItem);
            }
        }
    } else {
        scope.eventTargets[wEventType] = [];
        targets.forEach((tg) => {
            var tagItem = {
                target: tg,
                callBack: callBack
            };
            scope.eventTargets[wEventType].push(tagItem);
        });
    }
}

function removeEventTargets(wEventType, targets) {
    var scope = this;
    var curTargets = scope.eventTargets[wEventType];
    if (curTargets) {
        for (let i = 0; i < targets.length; i++) {
            var tg = targets[i];
            for (let j = 0; j < curTargets.length; j++) {
                if (curTargets[j].target == tg) {
                    curTargets.splice(j, 1);
                    break;
                }
            }
        }
    }
}

function rayCastPicker(wEventType) {
    var scope = this;
    var raycaster = new scope.THREE.Raycaster();
    raycaster.setFromCamera(scope.mouse, scope.camera);

    var objects = [];
    var curTargets = scope.eventTargets[wEventType];
    // 事件非遮挡情况
    // for (let i = 0; i < curTargets.length; i++) {
    //     objects.push(curTargets[i].target);
    // }
    // 事件遮挡情况
    objects = scope.scene.children;
    var intersects = raycaster.intersectObjects(objects,true);
    if (intersects.length > 0) {
        var tg = intersects[0].object;
        for (let j = 0; j < curTargets.length; j++) {
            if (curTargets[j].target == tg) {
                curTargets[j].callBack(new CallBackEvent(wEventType, tg));
                break;
            }
            else{
                tg.traverseAncestors((parent)=>{
                    if (curTargets[j].target == parent) {
                        curTargets[j].callBack(new CallBackEvent(wEventType, parent));
                        return;
                    }
                });
            }
        }
    }

    // for(let i=0;i<intersects.length;i++){
    //     var tg = intersects[i].object;
    //     for(let j=0;j<curTargets.length;j++){
    //         if(curTargets[j].target == tg){
    //             curTargets[j].callBack(wEventType,tg);
    //             break;
    //         }
    //     }
    // }
}

function _animate() {
    var scope = this;
    var wEventType = "mousemove";
    if (scope.eventTargets[wEventType] && scope.eventTargets[wEventType].length > 0) {
        rayCastPicker.call(scope, wEventType);
    }

    requestAnimationFrame(_animate.bind(scope));
}