<template>
  <div class="home">
    <div @click="onClickGoItem">手写板</div>
  </div>
</template>

<script>
export default {
  name: "home",
  methods: {
    onClickGoItem() {
      this.$router.push("/hand-writing");
    }
  }
};
</script>
