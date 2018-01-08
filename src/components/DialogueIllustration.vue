<template>
  <div cmpt :class="classBindings" @touchstart="touchstart" @touchend="touchend">
    <div  class="card">
        <div class="cardback"></div>
      <div v-show="dialogue" class="cardfront">
        <img v-show="dialogue.image" :src="dialogue.image"/>
        <div v-show="currentOption" class="dialogue-option-text">
          <div v-show="currentOption.content">{{currentOption.content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Hammer from 'hammerjs'
  export default {
    name: 'DialogueIllustration',
    methods: {
      moveWithTouch (ev) {
        this.$el.style.transitionDuration = `0s`
        this.$el.style.transform = `translate(${ev.deltaX / 5}%, ${Math.abs(ev.deltaX) / 15}%) rotate(${(ev.deltaX / 20)}deg) `
      },
      touchstart () {
        this.isTouching = true
      },
      touchend () {
        this.isTouching = false
      },
      restorePosition () {
        this.$el.style.transitionDuration = `0.5s`
        this.$el.style.transform = `translate(0%, 0%) rotate(0deg)`
      },
      fold () {
        this.isFolded = true
        this.isAnimating = true
      },
      foldNow () {
        this.$el.querySelector('.card').style.transition = 'none'
        this.$el.style.transition = 'none'
        this.fold()
        return new Promise(resolve => {
          setTimeout(() => {
            this.$el.querySelector('.card').style.transition = null
            this.$el.style.transition = null
            resolve()
          }, 10)
        })
      },
      flip () {
        this.isAnimating = true
        this.isFolded = false
      }
    },
    mounted () {
      const cardDom = this.$el.querySelector('.card')
      this.cardDom = cardDom
      cardDom.addEventListener('transitionstart', (evt) => {
        this.isAnimating = true
      })

      cardDom.addEventListener('transitionend', (evt) => {
        if (evt.target === cardDom) {
          this.isAnimating = false
        }
      })

      let hammer = Hammer(this.$el)
      hammer.get('pan').set({
        enable: true,
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 20
      })

      const commitThreshold = 150
      const respThreshold = 20

      this.$el.addEventListener('transitionend', evt => {
        if (evt.target === this.$el && this.shouldDropout) {
          this.$emit('vb-transition-over', this)
        }
      })
      /* eslint no-caller: "off" */
      hammer.on('pan', (ev) => {
        if (!this.isCurrent) {
          return
        }
        this.isHeld = true

        if (Math.abs(ev.deltaX) < commitThreshold) {
          this.moveWithTouch(ev)
        }

        if (ev.deltaX < 0) {
          this.optIndex = 0
        } else {
          this.optIndex = 1
        }

        if (Math.abs(ev.deltaX) < respThreshold) {
          this.shouldShowOpt = false
        } else {
          this.shouldShowOpt = true
        }

        if (!ev.isFinal) {
          return
        }

        this.isHeld = false
        // touch end
        this.shouldShowOpt = false
        if (Math.abs(ev.deltaX) < commitThreshold) {
          this.restorePosition()
        } else {
          this.$el.style.transform = null
          this.$el.style.transitionDuration = '0.5s'
          this.shouldDropout = true
          this.$emit('userSelect', this.dialogue, this.currentOption)
        }
      })
    },
    computed: {
      classBindings () {
        let r = {
          'dialogue-illustration': true,
          'show-option-text': this.shouldShowOpt,
          current: this.isCurrent,
          folded: this.isFolded,
          flipped: !this.isFolded,
          animating: this.isAnimating,
          'left-out': this.shouldDropout && this.optIndex === 0,
          'right-out': this.shouldDropout && this.optIndex === 1,
          'hover': this.isTouching || this.isAnimating || this.shouldDropout || this.isHeld
        }
        return r
      },
      currentOption () {
        if (this.dialogue.options && this.optIndex > -1) {
          return this.dialogue.options[this.optIndex]
        }
        return {}
      }
    },
    data () {
      return {
        optIndex: -1,
        shouldShowOpt: false,
        shouldDropout: false,
        isCurrent: false,
        isFolded: true,
        isTouching: false,
        isAnimating: false,
        dialogue: {}
      }
    }
  }
</script>

<style lang="stylus">
  @import "../style/colors.styl";
  @import "../style/dimensions.styl";
  @keyframes FlipOffset1 {
    0% {
      transform: translate(0%, 0%);
    }
    50% {
      transform: translate(5%, -5%);
    }
    0% {
      transform: translate(0%, 0%);
    }
  }

  @keyframes FlipOffset2 {
    0% {
      transform: translate(0%, 0%);
    }
    50% {
      transform: translate(5%, -5%);
    }
    0% {
      transform: translate(0%, 0%);
    }
  }

  @keyframes FloatUp {
    0% {
      box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
    }
    50% {
      box-shadow: 10px 14px 22px 0px rgba(0,0,0,1);
    }
    0% {
      box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
    }
  }

  .dialogue-illustration-container {
    width: 330px;
    height: 330px;
    position: relative;
    .dialogue-option-text {
      position: absolute;
      top: 0px;
      width: 100%;
      height: 35px;
      background: rgba(1, 1, 1, 0.2);
      transition-duration: 0.3s;
      transform: translate(0%, -100%);
      color: $color-primary-4;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
    }
    .show-option-text {
      .dialogue-option-text {
        transition-duration: 0.3s;
        transform: translate(0%, 0%);
      }

    }

    .dialogue-illustration {
      width: 330px;
      height: 330px;
      position: absolute;
      perspective: 500px;
      perspective-origin: 100px 100px;
      .card {
        width: 100%;
        height: 100%;
      }
      &.current:hover, &.current.hover {
        .card {
          box-shadow: 10px 14px 22px 0px rgba(0,0,0,1);
        }
      }
      &.flipped {
        animation: FilpOffset1 0.6s;
        .card {
          transform: rotateY(0deg);
        }
      }
      &.folded {
        animation: FilpOffset2 0.6s;
        .card {
          transform: rotateY(180deg);
        }
      }
    }

    dialogue-illustration, .cardfront, .cardback {
      width: 330px;
      height: 330px;
    }

    .card {
      transition: 0.6s;
      transform-style: preserve-3d;
      position: relative;
    }

    .cardfront, .cardback {
      backface-visibility: hidden;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
    }

    .cardfront {
      z-index: 2;
      background: white;
      transform: rotateY(0deg);
      img {
        width: 100%;
      }
    }

    .cardback {
      background: url("/static/cardback.jpg");
      transform: rotateY(180deg);
    }


    .dialogue-illustration.right-out {
      transform: translate(200%, 200%) rotate(180deg);
      transition-duration: 0.3s;
    }

    .dialogue-illustration.left-out {
      transform: translate(-200%, 200%) rotate(-180deg);
      transition-duration: 0.3s;
    }
  }

</style>
