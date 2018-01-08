<template>
  <div class="main-scene">
    <audio src="/static/sounds/firelin-shrine.ogg"></audio>
    <div class="top">
      <div class="player-stats-container">
        <div v-for="(v,k) in player" class="player-stat">{{k}}:{{v}}</div>
      </div>
    </div>
    <div class="mid">
      <div class="dialogue-container">
        <text-swapper ref="ts"></text-swapper>
      </div>
      <div class="dialogue-illustration-container">
        <dialogue-illustration
          ref="di3"
          @userSelect="onUserSelect"
          @vb-transition-over="onFinish"
        />
        <dialogue-illustration
          ref="di2"
          @userSelect="onUserSelect"
          @vb-transition-over="onFinish"
        />
        <dialogue-illustration
          ref="di1"
          @userSelect="onUserSelect"
          @vb-transition-over="onFinish"
        />
      </div>
    </div>
    <div style="position: absolute; top:0px">
      <button @click="toggleCard">Flip/Fold</button>
    </div>
    <div class="bottom"></div>
    <modal name="menu-modal" :clickToClose=false :adaptive=true>
      <div class="menu-modal">
        <el-button @click="gameStart" type="primary">Play</el-button>
      </div>
    </modal>
  </div>

</template>

<script>
  import {Dialogue, Option, NewDialogueEvent} from '@/core/dialogue'
  import {EventQueue, EventBus, Events} from '@/core/game-event'
  import DialogueIllustration from '@/components/DialogueIllustration.vue'
  import TextSwapper from '@/components/TextSwapper.vue'

  export default {
    name: 'MainScene',
    EventQueue,
    components: {
      DialogueIllustration,
      TextSwapper
    },
    created () {
      const option3 = new Option({
        content: 'Ok, I got it',
        EventQueue
      })

      const dialogue1 = new Dialogue({
        content: 'There\'s only one game in this world. The grand game of life.',
        image: '/static/portrait.png',
        options: [option3, option3]
      })

      const dialogue2 = new Dialogue({
        content: 'Of course, who doesn\'t?',
        EventQueue,
        image: '/static/portrait.png',
        options: [option3, option3]
      })

      const option1 = new Option({
        content: 'I want to know more about this game.',
        EventQueue,
        player: this.player,
        customScript: {
          onResolve: `context.player.intel += 10`
        }
      })
      option1.subDialogues = {afterResolve: dialogue1}

      const option2 = new Option({
        content: 'I want to win at the starting line.',
        player: this.player,
        EventQueue,
        customScript: {
          onResolve: `context.player.luck += 10`
        }
      })
      option2.subDialogues = {afterResolve: dialogue2}

      const seedDialogue = new Dialogue({
        content: 'Oh, why are you still here?',
        image: '/static/portrait.png',
        options: [option1, option2]
      })

      option3.subDialogues = {afterResolve: seedDialogue}
      EventQueue.push(new NewDialogueEvent(seedDialogue))
      EventBus.addListener(NewDialogueEvent.evtName, this.onNewDialogueEvent)
    },
    mounted () {
      this.$modal.show('menu-modal')
      this.illutrationContainer = this.$el.querySelector('.dialogue-illustration-container')
      this.DIRefList = [this.$refs.di1, this.$refs.di2]
      this.currentDICmpt = this.shiftCurDICmpt()
      // this.currentDICmpt.dialogue = this.dialogue
    },
    methods: {
      toggleCard () {
        if (this.currentDICmpt.isFolded) {
          this.currentDICmpt.flip()
        } else {
          this.currentDICmpt.fold()
        }
      },
      onFinish (cmpt) {
        cmpt.foldNow()
        cmpt.shouldDropout = false
        cmpt.isCurrent = false
        const p = cmpt.$el.parentNode
        p.removeChild(cmpt.$el)
        if (p.childNodes.includes(this.currentDICmpt.$el)) {
          p.insertBefore(cmpt.$el, this.currentDICmpt.$el)
        } else {
          p.appendChild(cmpt.$el)
          cmpt.isCurrent = true
          cmpt.flip()
        }
      },
      onUserSelect (dialogue, option) {
        option.resolve()
        option.optionPromise.then(() => {
          this.currentDICmpt = this.shiftCurDICmpt()
          this.currentDICmpt.flip()
          EventBus.emit(Events.NextEvent, 'onUserSelect')
          option.refresh()
        })
      },
      shiftCurDICmpt () {
        this.currentDICmpt = this.DIRefList.shift()
        this.DIRefList.push(this.currentDICmpt)
        this.currentDICmpt.isCurrent = true
        return this.currentDICmpt
      },
      gameStart () {
        this.$modal.hide('menu-modal')
        // this.$el.querySelector('audio').play()
        EventBus.emit(Events.NextEvent, 'GameStart')
        this.currentDICmpt.flip()
        this.currentDICmpt.isCurrent = true
      },
      onNewDialogueEvent (evt) {
        if (!evt) {
          return
        }
        this.dialogue = evt.dialogue
        this.currentDICmpt.dialogue = evt.dialogue
        this.currentDICmpt.flip()
        this.currentDICmpt.isCurrent = true
        this.$refs.ts.pushContent(this.dialogue.content)
      }
    },
    data () {
      return {
        player: {
          luck: 50,
          intel: 50,
          fortune: 50,
          social: 50,
          charisma: 50
        },
        dialogue: null,
        illutrationContainer: null
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  @import "../style/colors.styl";
  @import "../style/dimensions.styl";
  .menu-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .main-scene {
    max-width: 700px;
    min-width: 350px;
    max-height: 1280px;
    min-height: 680px;
    width: 50%;
    height: 80%;
    background: $color-secondary-2-3;
    .top {
      height: 10%;
      .player-stats-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 100%;
      }
      .player-stats {
      }
    }
    .mid {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 80%;
      .dialogue-container {
        max-width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 20%;
      }
      span.dialogue-text {
        max-width: 100%;
        color: $color-secondary-1-4;
        font-size: $font-size-m;
      }
      background: $color-secondary-1-1;
    }
  }
</style>
