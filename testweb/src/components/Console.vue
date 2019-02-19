<template>
<div class="console">
  <div class='console-title'>Console</div>
  <textarea
    :value="log"
    readonly="readonly"
    wrap="off"
    class="output-container"
  />
  </div>
</template>

<script>
export default {
  props: ['log'],
  data() {
    return {
      msg: " ",
    }
  },
  methods: {
    // kk
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.console {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgb(40,40,40);
    color: rgb(55, 255, 55);

    .console-title {
        margin: 6px;
        font-size: 1.2em;
        text-transform: uppercase;
    }

    .output-container {
        width: 100%;
        min-height: 400px;
        resize: none;
        outline: none;
        font-size: 0.8em;
        font-family: monospace;
        overflow: auto;
        padding-left: 20px;

        &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        &::-webkit-scrollbar-track {
            background: black;
        }

        &::-webkit-scrollbar-thumb {
            background-color: darkgreen;
        }
        &::-webkit-scrollbar-corner {
            background: black;
        }
    }
}
</style>
