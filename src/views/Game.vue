<template>
    <div>
        <h1>2048 - vue</h1>    
        <div class="wrapper">
            <div class="controller">
                <div class="rightbutton" @click="toggle('right')"></div>
                <div class="leftbutton" @click="toggle('left')"></div>
                <div class="topbutton" @click="toggle('up')"></div>
                <div class="bottombutton" @click="toggle('down')"></div>
                <transition-group name="panel" tag="ul" id=container v-if="show">
                    <div 
                        v-for="(item, index) in panels" 
                        :key="item.id" 
                        class="container-item" 
                        :style="styles[index]"
                    >
                        {{item.number==-1?"":item.number}}
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
export default {
    data() {
        const width = 4
        const panels = [...new Array(width*width)].map(function(_, index){
            return {
                id : Math.random().toString(36).slice(-16),
                number : -1
            }
        })
        return {
            width : width,
            show : false,
            map : [],
            panels : panels,
            ids : [],
            colors : [
                "#fff3b8",
                "#fdd35c", 
                "#fcc800",
                "#f5a800",
                "#f0b483",
                "#f3a68c",
                "#f1a68c",
                "#ed6d46",
                "#eb6d46",
                "#ea5550",
                "#e5553a",
                "#e0553a"
            ],
            styles : []
        }
    },
    computed : {
        getMapSize : function(){
            return this.width * this.width
        }
    },
    methods : {
        getReverseDir : function(dir){
            if(dir === "right"){
                return "left"
            }else if(dir === "left"){
                return "right"
            }else if(dir === "up"){
                return "down"
            }else{
                return "up"
            }
        },
        makeID: function(id){
            return "item-"+String(id) 
        },
        getRandomInt : function(max) {
            return Math.floor(Math.random() * Math.floor(max));
        },
        getBGColor : function(num){
            return this.colors[this.getBaseLog(2, num) - 1]
        },
        getStyle : function(index) {
            if(this.panels[index].number === -1)return {}
            return {
                backgroundColor : this.getBGColor(this.panels[index].number)
            }
        },
        getBaseLog : function(x, y) {
            return Math.log(y) / Math.log(x);
        },
        verifySpawnBlock : function(dir) {
            for(var i = 0; i < this.getMapSize; i++){
                if(this.panels[i].number===-1){
                    return true
                }
            }
            return false
        },
        getDirCoordinate(i, j, dir){
            return (
                dir == "right" ? (i * 4) + 3-j
                : dir == "left" ? (i * 4) + j
                : dir == "up" ? i + j*4
                : i + (3-j)*4
            )
        },
        verifyMoveBlock : function(dir) {
            var isPopSpace = false
            var before = -1
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 4; j++){
                    var now = this.getDirCoordinate(i, j, dir)
                    if(this.panels[now].number === -1)isPopSpace = true
                    if(this.panels[now].number !== -1 && isPopSpace)return true
                    if(before !== -1){
                        if(before === this.panels[now].number)return true
                    }else{
                        before = this.panels[now].number
                    }
                }
                isPopSpace = false
            }
            return false
        },
        MoveBlock : function(dir) {
            for(var i = 0; i < 4; i++){
                var before = -1
                var bindex = -1
                var stack = []
                var now = 0
                for(var j = 0; j < 4; j++){
                    now = this.getDirCoordinate(i, j, dir)
                    if(this.panels[now].number === -1)continue
                    if(before === -1){
                        before = this.panels[now].number
                        bindex = now
                        continue
                    }else{
                        if(this.panels[now].number == before){
                            stack.push({
                                score : this.panels[now].number*2,
                                index : now
                            })
                            before = -1
                        }else{
                            stack.push({
                                score : before,
                                index : bindex
                            })
                            before = this.panels[now].number
                            bindex = now
                        }
                    }
                }
                if(before !== -1)stack.push({
                    score : before,
                    index : bindex
                })
                console.log(stack)
                for(var j = 0; j < 4; j++){
                    var now = this.getDirCoordinate(i, j, dir)
                    if(stack.length <= j){
                        this.panels[now].number = -1
                    }else{
                        const tmp = this.panels[now]
                        this.panels[stack[j]['index']].number = stack[j]['score']
                        this.panels[now] = this.panels[stack[j]['index']]
                        this.panels[stack[j].index] = tmp
                    }
                    this.refreshMapData(now)
                }
            }
        },
        updateMapData : function(now, number) {
            this.panels[now].number = number
            this.styles.splice(now, 1, this.getStyle(now))
        },
        refreshMapData : function(now) {
            this.updateMapData(now, this.panels[now].number)
        },
        SpawnBlock : function(number) {
            for(var i = 0; i < number; i++){
                var a = this.getRandomInt(this.getMapSize)
                if(this.panels[a].number !== -1){
                    i--;
                    continue
                }
                this.updateMapData(a, (this.getRandomInt(2)+1)*2)
            }
        },
        toggle(dir) {
            if(!this.verifyMoveBlock(dir))return
            this.MoveBlock(dir)
            setTimeout(function() {
                if(!this.verifySpawnBlock())return
                this.SpawnBlock(1)
            }.bind(this), 500);
        }
    },
    created : function(){
        this.styles = new Array(this.getMapSize)
        for(var i = 0; i < this.panels.length; i++){
            this.styles[i] = this.getStyle(i)
        }
        //initialize value for 2 mass
        this.SpawnBlock(2)
        this.show = true
    }
}
</script>

<style lang="less">

@controllerBox : 60px;
@boxsize : 80px;
@controllerColor : rgba(0, 153, 255, 0.342);
#container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    row-gap: 3px;
    column-gap: 3px;
    width: auto;
    background-color: dimgray;
    padding: 5px;
    margin: 0 auto;
}

.wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}

.container-item{
    display: flex;
    justify-content: center;
    align-items: center;
    height: @boxsize;
    width: @boxsize;
    border-radius: 5px;
    font-size: 3vmax;
    font-weight: bold;
    color:dimgray;
}

.controller{
    position: relative;
    background-color: rgba(0, 0, 0, 0.466);
    z-index:42;
    -webkit-tap-highlight-color:transparent; 
}

.rightbutton {
    position: absolute;
    top: calc(50% - @boxsize/2);
    right: @boxsize/2;
    width : @boxsize;
    height: @boxsize;
    background-color: @controllerColor;
}

.leftbutton {
    position: absolute;
    top: calc(50% - @boxsize/2);
    left: @boxsize/2;
    width : @boxsize;
    height: @boxsize;
    background-color: @controllerColor;
}

.topbutton {
    position: absolute;
    top: @boxsize/2;
    right: calc(50% - @boxsize/2);
    width : @boxsize;
    height: @boxsize;
    background-color: @controllerColor;
}

.bottombutton {
    position: absolute;
    bottom: @boxsize/2;
    right: calc(50% - @boxsize/2);
    width : @boxsize;
    height: @boxsize;
    background-color: @controllerColor;
}
.panel-move {
    transition: transform 0.5s;
}
</style>
