(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["home"],{"16c0":function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"home"},[n("a-list",{attrs:{bordered:"",dataSource:t.searchList.length?t.searchList:t.data},scopedSlots:t._u([{key:"renderItem",fn:function(e){return n("a-list-item",{on:{click:function(n){return t.onClickGoItem(e.path)}}},[n("a-list-item-meta",{attrs:{description:e.description}},[n("div",{attrs:{slot:"title"},slot:"title"},[t._v("\n          "+t._s(e.name)+"\n        ")])]),n("div",[e.phone?n("a-icon",{attrs:{type:"mobile"}}):t._e()],1)],1)}}])},[n("div",{attrs:{slot:"header"},slot:"header"},[t._v("\n      DEMO列表(注：列表尾部有手机图标的须在移动端模式下查看或调试。)\n    ")])])],1)},i=[],o={name:"home",data:function(){return{}},computed:{data:function(){return this.$store.state.demoList},searchList:function(){return this.$store.state.searchList}},created:function(){console.log(this)},methods:{onClickGoItem:function(t){this.$router.push(t)}}},r=o,a=(n("42ff"),n("2877")),c=Object(a["a"])(r,s,i,!1,null,"2e5986f9",null);e["default"]=c.exports},"42ff":function(t,e,n){"use strict";var s=n("6ff3"),i=n.n(s);i.a},"6ff3":function(t,e,n){}}]);
//# sourceMappingURL=home.4046028d.js.map