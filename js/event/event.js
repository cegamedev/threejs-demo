class Callclick{
    constructor(){

    }
    static runCallBack(event){

    }
}

class Callmousemove{
    constructor(){

    }
    static runCallBack(event){

    }
}

class Event{
    constructor(){
        this.eventMap = {
            click:"click",
            mousemove:"mousemove"
        };
        this.evntTargets = {};
        initWindowEvent.call(this);
    }
    
    static on(eventType,targets,callBack){
        if(!this.eventMap[eventType]){
            return;
        }
        addEventTargets.call(this,eventType,targets);
    }

    static off(eventType,targets){
        if(!this.eventMap[eventType]){
            return;
        }
        removeEventTargets.call(this,eventType,targets);
    }

}

function initWindowEvent(){
    var scope = this;
    for(let i in scope.eventMap){
        var eventType = scope.eventMap[i];
        document.addEventListener(eventType,winCallBack);
    }
}

function winCallBack(event){
    var callBackClass = eval(`Call${event.type}`);
    callBackClass.runCallBack(event);
}



function addEventTargets(eventType,targets){
    var scope = this;
    var curTargets = scope.evntTargets[eventType];
    if(curTargets){
        var addTargets = [];
        targets.forEach((tg)=>{
            if(curTargets.indexOf(tg) == -1){
                addTargets.push(tg);
            }
        });
        curTargets = curTargets.concat(addTargets);
    }
    else{
        scope.evntTargets[eventType] = [];
        targets.forEach((tg)=>{
            scope.evntTargets[eventType].push(tg);
        });
    }
}

function removeEventTargets(eventType,targets){
    var scope = this;
    var curTargets = scope.evntTargets[eventType];
    if(curTargets){
        targets.forEach((tg)=>{
            var index = curTargets.indexOf(tg);
            if(index > -1){
                curTargets.splice(index,1);
            }
        });
    }
}