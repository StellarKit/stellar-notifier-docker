<template>
<v-app>
  <Main />
</v-app>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons');

#app {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    padding-top: 60px;
    background: rgba(0,0,0,.01);
}
</style>
