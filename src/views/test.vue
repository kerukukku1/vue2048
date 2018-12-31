<template>
    <div id="game" class="game">
        <button @click="shuffle();">Shuffle</button>
        <transition-group name="flip-list" class="flex-container">
            <div
                class="panel"
                v-for="(panel, panel_i) in panels"
                v-bind:key="panel.num"
                @click="swapPanels(panel_i);"
                :class="{ numberPanel: !panel.isBlank }"
            >
                {{ panel.num != 0 ? panel.num : "" }}
            </div>
        </transition-group>
    </div>
</template>

<script>
export default {
        data: function() {
            const panels = [...Array(15)].map((_, i) => ({
                isBlank: false,
                num: i + 1
            }));
            panels.push({
                isBlank: true,
                num: 0
            });
        return {
            panels: panels
        };
    },
    methods: {
        shuffle: function() {
            const array = this.panels;
            for (let i = array.length - 1; i > 0; i--) {
                let r = Math.floor(Math.random() * (i + 1));
                let tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }
            this.panels = this.panels.slice(0);
        },
        swapPanels(panelIndex) {
            const swappableIndexes = this.makeSwappableIndexes();
            const blankIndex = this.panels.findIndex(v => v.isBlank);
            if (swappableIndexes.includes(panelIndex)) {
                const tmp = this.panels[panelIndex];
                this.panels[panelIndex] = this.panels[blankIndex];
                this.panels[blankIndex] = tmp;
                this.panels = this.panels.slice(0);
                console.log("pass");
            }
            console.log(swappableIndexes);
            console.log(this.panels);
        },
        makeSwappableIndexes: function() {
            const blankIndex = this.panels.findIndex(v => v.isBlank);
            const swappableIndexes = [];
            if (blankIndex % 4 !== 0) {
                swappableIndexes.push(blankIndex - 1);
            }
            if (blankIndex % 4 !== 3) {
                swappableIndexes.push(blankIndex + 1);
            }
            if (blankIndex - 4 >= 0) {
                swappableIndexes.push(blankIndex - 4);
            }
            if (blankIndex + 4 <= 15) {
                swappableIndexes.push(blankIndex + 4);
            }
            return swappableIndexes;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-container {
    display: flex;
    flex-wrap: wrap;
    width: 400px;
    background-color: gray;
}
.panel {
    width: 90px;
    height: 90px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
}
.numberPanel {
    background-color: yellow;
}
.flip-list-move {
    transition: transform 0.5s;
}
</style>
