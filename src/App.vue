<template>
  <div id="app">
    <main-scene></main-scene>
  </div>
</template>

<script>
  import MainScene from './components/MainScene.vue'
  document.addEventListener('touchstart', (e) => e.preventDefault(), false)
  document.addEventListener('touchmove', (e) => e.preventDefault(), false)
  var app = {
    name: 'app',
    components: {
      MainScene
    }
  }
  export {app as default}
</script>

<style lang="stylus">
  @import './style/colors.styl';
  @import './style/global.styl';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $color-secondary-1-1;
    background-color: $color-secondary-2-3;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
