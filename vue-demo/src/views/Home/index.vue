<template>
  <div class="home">
      这是首页
      <div @click="onCickPush">写字板</div>
  </div>
</template>

<script>

export default {
  name: 'home',
  methods: {
      onCickPush () {
          this.$router.push('/hand-writing')
      }
  },
}
</script>

