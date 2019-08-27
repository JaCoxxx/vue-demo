<template>
  <div id="app">
    <div class="header">
      <div v-if="!search">
        <a-icon v-if="!header.home" class="icon" type="left" @click="goBack" />
        <span>{{ header.name }}</span>
        <a
          v-if="!header.home && header.source"
          :href="header.source"
          target="_black"
          class="link"
        >
          <a-icon type="github" />
        </a>
        <a-icon
          v-if="header.home"
          class="icon-r"
          type="search"
          @click="search = true"
        />
      </div>
      <div v-else>
        <a-input-search
          placeholder="搜索DEMO"
          style="width: 80%"
          @search="onSearch"
        />
        <span class="cancel" @click="onCancel">取消</span>
      </div>
    </div>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      header: {
        name: "VUE-DEMO列表",
        home: true
      },
      search: false
    };
  },
  computed: {
    demoList() {
      return this.$store.state.demoList;
    }
  },
  watch: {
    $route: function() {
      this.header =
        this.$route.path === "/"
          ? {
              name: "VUE-DEMO列表",
              home: true
            }
          : this.demoList.find(item => item.path === this.$route.path);
      document.title = `${
        this.$route.path === "/"
          ? "DEMO列表"
          : this.demoList.find(item => item.path === this.$route.path).name
      } | JaCo的DEMO库`;
    }
  },
  created() {
    console.log(this.$route.path);
  },
  methods: {
    ...mapActions(["setSearchList"]),
    goBack() {
      this.$router.push("/");
    },
    onSearch(value) {
      let _data = this.demoList.filter(item => item.name.includes(value));
      _data = _data.length ? _data : [{ name: "暂无搜索结果" }];
      this.setSearchList(_data);
    },
    onCancel() {
      this.search = false;
      this.setSearchList([]);
    }
  }
};
</script>

<style>
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
button,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}
body {
  background: #fff;
  color: #555;
  font-size: 16px;
  font-family: Verdana, Arial, Helvetica, sans-serif;
}
td,
th,
caption {
  font-size: 14px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
  font-size: 100%;
}
address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
  font-style: normal;
  font-weight: normal;
}
a {
  color: #fff;
  text-decoration: none;
}
a:hover,
a:active,
a:link {
  color: #fff !important;
  text-decoration: underline;
}
img {
  border: none;
}
ol,
ul,
li {
  list-style: none;
}
input,
textarea,
select,
button {
  font: 16px Verdana, Helvetica, Arial, sans-serif;
}
table {
  border-collapse: collapse;
}
html {
  overflow-y: scroll;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  *zoom: 1;
}

html,
body,
#app {
  overscroll-behavior-y: contain;
  width: 100%;
  height: 100%;
}
.header {
  position: relative;
  width: 100%;
  height: 38px;
  background: #000;
  color: #fff;
  text-align: center;
  line-height: 38px;
}
.icon {
  color: #fff;
  position: absolute;
  top: 12px;
  left: 10px;
}
.link {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 38px;
  line-height: 38px;
  color: #fff;
  transform: scale(1.2, 1.2);
}
.icon-r {
  color: #fff;
  position: absolute;
  right: 12px;
  top: 12px;
}
.body {
  width: 100%;
  height: calc(100vh - 38px);
  overflow-y: auto;
}
.header .ant-input-search .ant-input {
  border: 0;
  border-bottom: 1px solid #000;
  border-radius: 0;
  background: transparent;
  color: #fff;
}
.header .ant-input-search .ant-input-search-icon {
  color: #fff;
}
.cancel {
  float: right;
  margin-right: 10px;
  height: 38px;
  line-height: 38px;
}
</style>
