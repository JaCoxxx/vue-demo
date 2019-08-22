<template>
  <div class="home">
    <a-list bordered :dataSource="data">
      <a-list-item
        slot="renderItem"
        slot-scope="item"
        @click="onClickGoItem(item.path)"
      >
        <a-list-item-meta :description="item.description">
          <div slot="title">
            {{ item.name }}
          </div>
        </a-list-item-meta>
        <div><a-icon v-if="item.phone" type="mobile" /></div>
      </a-list-item>
      <div slot="header">
        DEMO列表(注：列表尾部有手机图标的须在移动端模式下查看或调试。)
      </div>
    </a-list>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  computed: {
    data() {
      return this.$store.state.demoList;
    }
  },
  created() {
    console.log(this);
  },
  methods: {
    onClickGoItem(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="css" scoped>
.home {
  margin: 10px 30px;
  font-size: 18px;
}
.ant-list {
  font-size: 18px;
}
.ant-list-item-meta-title {
  font-size: 18px;
}
</style>
