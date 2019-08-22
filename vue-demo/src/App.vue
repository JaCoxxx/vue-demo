<template>
  <div id="app">
    <div class="header">
      <a-icon v-if="!header.home" class="icon" type="left" @click="goBack" />
      <span>{{ header.name }}</span>
    </div>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      header: {
        name: "VUE-DEMO列表",
        home: true
      }
    };
  },
  computed: {
    demoList() {
      return this.$store.state.demoList;
    }
  },
  watch: {
    $route: function(to, from) {
      console.log(this.$route.path, to, from);
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
      } | JaCo的小站`;
    }
  },
  created() {
    console.log(this.$route.path);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
  color: #555;
  text-decoration: none;
}
a:hover {
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
  width: 100%;
  height: 100%;
}
.header {
  position: relative;
  width: 100%;
  height: 38px;
  background: #1890ff;
  text-align: center;
  line-height: 38px;
}
.icon {
  position: absolute;
  top: 12px;
  left: 10px;
}
.body {
  width: 100%;
  height: calc(100vh - 38px);
  overflow-y: auto;
}
</style>
