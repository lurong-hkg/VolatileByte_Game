<template>
  <div cmpt class="text-swapper-container">
  </div>
</template>

<script>
  export default {
    name: 'TextSwapper',
    methods: {
      pushContent (content) {
        const el = document.createElement('div')
        el.classList.add('text-swapper-content', 'animated', 'fadeInDown')
        el.innerText = content
        const els = this.$el.querySelectorAll('.text-swapper-content')
        if (els) {
          els.forEach((contentSpan) => {
            this.$el.removeChild(contentSpan)
          })
        }
        this.$el.appendChild(el)
      }
    }
  }
</script>

<style lang="stylus">
  @import "../style/animate.css"
  @import "../style/colors.styl";
  @import "../style/dimensions.styl";

  div.text-swapper-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content : center;
  }
  div.text-swapper-content {
    max-width: 100%;
    color: $color-secondary-1-4;
    font-size: $font-size-m;
  }
</style>
