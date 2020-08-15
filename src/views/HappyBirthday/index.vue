<template>
  <div class="container" @click.stop.prevent="onClickImg">
    <div class="card" :class="{'card-hover': isCardHover}" :style="cardStyle">
      <div class="imgBox" :class="{'ripple': !isCardHover}" @click.stop="onClickImg">
        <div class="bark"></div>
        <img src="../../assets/images/page.png" alt />
      </div>
      <div id="details" class="datails">
        <p>{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Typed from "typed.js";
export default {
  name: "HappyBirthday",
  data: function() {
    return {
      isCardHover: false,
      content: "",
      intId: undefined
    };
  },
  computed: {
    cardStyle() {
      return {};
    }
  },
  mounted() {
  },
  methods: {
    onClickImg() {
      this.isCardHover = !this.isCardHover;
      const _this = this;
      if (this.isCardHover) {
        setTimeout(() => {
          const contentArr = `假如我是一朵雪花，\n翩翩的在半空里潇洒，\n我一定认清我的方向——\n飞扬，飞扬，飞扬——\n这地面上有我的方向。\n不去那冷寞的幽谷，\n不去那凄清的山麓，\n也不上荒街去惆怅——\n飞扬，飞扬，飞扬——\n你看，我有我的方向！\n在半空里娟娟地飞舞，\n认明了那清幽的住处，\n等着她来花园里探望——\n飞扬，飞扬，飞扬——\n啊，她身上有朱砂梅的清香！\n那时我凭借我的身轻，\n盈盈地，沾住了她的衣襟，\n贴近她柔波似的心胸——\n消溶，消溶，消溶——\n溶入了她柔波似的心胸！`.replace(" ", "");
          let content = "";
          let index = 0;
          _this.intId = setInterval(() => {
            content += contentArr[index];
            _this.content = content + "_";
            index++;
            if (index === contentArr.length) {
              _this.content = content;
              clearInterval(_this.intId);
            }
          }, 300);
        }, 2000);
      } else {
        clearInterval(_this.intId);
        this.content = "";
      }
    }
  }
};
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #fde3a7;
  font-family: "Indie Flower", cursive;
}
.container {
  width: 100%;
  height: 100%;
}

.card {
  position: absolute;
  width: 300px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin: -200px 0 0 -150px;
  background-color: #e0e1dc;
  transform-style: preserve-3d;
  /*景深*/
  perspective: 2000px;
  transition: 1s;
  box-shadow: inset 300px 0 50px rgba(0, 0, 0, 0.5),
    20px 0 60px rgba(0, 0, 0, 0.5);
  transform: rotateZ(-15deg);
}
.card::before {
  content: "";
  width: 100%;
  height: 5px;
  position: absolute;
  top: -5px;
  background-color: #bac1ba;
  transform-origin: bottom;
  transform: skewX(-45deg);
}
.card::after {
  content: "";
  width: 5px;
  height: 100%;
  top: 0;
  position: absolute;
  right: -5px;
  background-color: #bac1ba;
  transform-origin: left;
  transform: skewY(-45deg);
}

.card .imgBox {
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: left;
  transition: 0.7s;
}
.card .imgBox img {
  width: 100%;
}

.card .bark {
  position: absolute;
  background-color: #e0e1dc;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.card .datails {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 50px;
  z-index: -1;
}

.card .datails h4 {
  font-size: 26px;
  line-height: 40px;
  text-align: center;
  font-family: "Amatic SC", cursive;
}

.card .datails p {
  line-height: 15px;
  padding: 0 20px;
  white-space: pre-line;
  font-size: 12px;
}

.card-hover {
  transform: rotateZ(0) scale(1.2);
  box-shadow: inset 20px 10px 50px rgba(0, 0, 0, 0.5),
    20px 0 60px rgba(0, 0, 0, 0.5);
}

.card-hover .imgBox {
  transform: rotateY(-135deg);
}

.card-hover .bark {
  opacity: 1;
  transition: 0.6s;
  box-shadow: 300px 200px 100px rgba(0, 0, 0, 0.4) inset;
}

.title1 {
  color: #1bbc9b;
}
.title2 {
  color: #c0392b;
  margin-bottom: 30px;
}
.text-right {
  text-align: right;
}

.card-hover .dayin {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  animation: dy 5s steps(50, end);
}

.ripple {
  position: relative;
  overflow: hidden;
}

.ripple:after {
  content: "";
  background: rgba(255, 255, 255, 0.3);
  display: block;
  position: absolute;
  animation: ripple 3s ease-in-out infinite;
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

@keyframes dy {
  from {
    width: 0;
  }
}

@keyframes ripple {
  to {
    padding-top: 240%;
    padding-left: 240%;
    margin-top: -120%;
    margin-left: -120%;
    opacity: 0;
  }
  from {
    padding-top: 0;
    padding-left: 0;
    margin-top: 0;
    margin-left: 0;
    opacity: 1;
  }
}
</style>
