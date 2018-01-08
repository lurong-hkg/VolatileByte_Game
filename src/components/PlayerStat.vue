<template>
  <div class="player-stat">
    {{stat}}
    <div class="player-stat-delta">
      {{statDelta}}
    </div>
  </div>
</template>

<script>
  import {EventBus} from '@/core/game-event'

  export const Events = {
    UpdatePlayerStat: 'UpdatePlayerStats'
  }

  export default {
    name: 'PlayerStat',
    props: ['statName'],
    mounted () {
      EventBus.addListener(Events.UpdatePlayerStat, this.onStatUpdate)
    },
    methods: {
      onStatUpdate (evt) {
        if (evt.statname === this.statName) {
          this.stat += evt.statDelta
          this.statDelta = evt.statDelta
        }
      }
    },
    data () {
      return {
        stat: 0,
        statDelta: 0
      }
    }
  }

</script>

<style lang="stylus">

</style>
