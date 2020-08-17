<template>
  <div class="container" ref="canvasBox">
    <div
      class="card"
      :class="{ 'card-hover': isCardHover }"
      :style="cardStyle"
      @click.stop.prevent="onClickImg"
    >
      <div
        class="imgBox"
        :class="{ ripple: !isCardHover }"
        @click.stop="onClickImg"
      >
        <div class="bark"></div>
        <img src="@/assets/images/page.png" alt />
      </div>
      <div
        id="details"
        class="datails"
        :class="{ 'content-hover': isContentHover }"
      >
        <div class="content-bark"></div>
        <p>{{ content }}</p>
        <!-- <div v-if="isCardHover && !isContentHover" class="content-click"></div> -->
      </div>
      <div class="datails content-two"></div>
    </div>
    <span class="icon-span" @click="isMusic = !isMusic">
      <svg
        t="1597573233742"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2163"
        width="32"
        height="32"
        class="icon-anim"
        :style="{ 'animation-play-state': isMusic ? 'running' : 'paused' }"
      >
        <path
          d="M768.496 359.12L648.224 572a128 128 0 1 1-1.648-92.288l90.784-160.656A295.2 295.2 0 0 0 520 224C356.512 224 224 356.512 224 520S356.512 816 520 816C683.472 816 816 683.472 816 520c0-59.328-17.44-114.56-47.504-160.88zM600.272 562.352l-0.272-0.144 1.648-2.912a80 80 0 1 0-1.376 3.072zM864 520C864 709.984 709.984 864 520 864S176 709.984 176 520 330.016 176 520 176 864 330.016 864 520z"
          p-id="2164"
          fill="#d81e06"
        />
      </svg>
    </span>
    <audio loop autoplay ref="music">
      <source src="@/assets/music/Summer.mp3" type="audio/mpeg" />
      呀！音乐被偷走了~~
    </audio>
  </div>
</template>

<script>
export default {
  name: "HappyBirthday",
  data: function() {
    return {
      isCardHover: false,
      isContentHover: false,
      content: "",
      cursorIndex: 2,
      intId: undefined,
      isMusic: true
    };
  },
  computed: {
    cardStyle() {
      return {};
    }
  },
  watch: {
    isMusic: function(val) {
      console.log(val);
      if (val) this.$refs.music.play();
      else this.$refs.music.pause();
    }
  },
  mounted() {},
  methods: {
    onClickImg() {
      this.isCardHover = !this.isCardHover;
      this.isContentHover = false;
      const _this = this;
      if (this.isCardHover) {
        this.content = "_";
        setTimeout(() => {
          const contentArr = `假如我是一朵雪花，\n翩翩的在半空里潇洒，\n我一定认清我的方向——\n飞扬，飞扬，飞扬——\n这地面上有我的方向。\n不去那冷寞的幽谷，\n不去那凄清的山麓，\n也不上荒街去惆怅——\n飞扬，飞扬，飞扬——\n你看，我有我的方向！\n在半空里娟娟地飞舞，\n认明了那清幽的住处，\n等着她来花园里探望——\n飞扬，飞扬，飞扬——\n啊，她身上有朱砂梅的清香！\n那时我凭借我的身轻，\n盈盈地，沾住了她的衣襟，\n贴近她柔波似的心胸——\n消溶，消溶，消溶——\n溶入了她柔波似的心胸！`.replace(
            " ",
            ""
          );
          let content = "";
          let index = 0;
          _this.intId = setInterval(() => {
            if (contentArr[index] === `\n` && _this.cursorIndex !== 0) {
              _this.cursorIndex--;
            } else {
              content += contentArr[index];
              _this.content = content + "_";
              index++;
              this.cursorIndex = 2;
            }

            if (index === contentArr.length) {
              _this.content = content;
              clearInterval(_this.intId);
              this.intId = undefined;
            }
          }, 150);
        }, 2000);
      } else {
        clearInterval(_this.intId);
        this.intId = undefined;
        this.content = "";
      }
    },
    onClickContent() {
      // this.isContentHover = !this.isContentHover;
      // if (this.intId) clearInterval(this.intId);
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
  z-index: 12;
}
.card .imgBox img {
  width: 100%;
}

.card .bark,
.content-bark {
  position: absolute;
  background-color: #e0e1dc;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.content-bark {
  top: 0;
}

.card .datails {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  width: 100%;
  height: 100%;
  z-index: 11;
  transform-origin: left;
  transform-style: preserve-3d;
  /*景深*/
  perspective: 2000px;
  transition: 1s;
}

.card .datails.content-two {
  z-index: 10;
  transform-origin: center;
  transform: rotateZ(-90deg) scaleX(1.33) translateY(50px);
  background: url(/img/background.c3648a25.gif) no-repeat 0 0/400px 300px;
}

.card .datails h4 {
  font-size: 26px;
  line-height: 40px;
  text-align: center;
  font-family: "Amatic SC", cursive;
}

.card .datails p {
  line-height: 15px;
  padding: 0 20px 0 50px;
  white-space: pre-line;
  font-size: 12px;
  color: #fff;
}

.card-hover {
  transform: rotateZ(0) scale(1.2);
  box-shadow: inset 20px 10px 50px rgba(0, 0, 0, 0.5),
    20px 0 60px rgba(0, 0, 0, 0.5);
}

.card-hover .imgBox,
.content-hover {
  transform: rotateY(-135deg);
}

.card-hover .bark,
.content-hover .content-bark {
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
  background: rgba(255, 255, 255, 0.5);
  display: block;
  position: absolute;
  animation: ripple 3s ease-in-out infinite;
  border-radius: 50%;
  top: 50%;
  left: 50%;
}

.content-click {
  width: 0;
  height: 0;
  display: inline-block;
  border-radius: 50%;
  position: absolute;
  bottom: 20px;
  left: 50%;
  background: rgba(255, 255, 255, 0.5);
  animation: click-ripple 3s ease-in-out infinite;
}

.my-canvas {
  margin-top: -50px;
}

.icon-span {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
}

.icon-anim {
  animation: icon-spin 5s linear infinite;
}

@keyframes dy {
  from {
    width: 0;
  }
}

@keyframes ripple {
  to {
    padding-top: 120%;
    padding-left: 120%;
    margin-top: -60%;
    margin-left: -60%;
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

@keyframes click-ripple {
  to {
    padding-top: 16%;
    padding-left: 16%;
    margin-top: -8%;
    margin-left: -8%;
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

@keyframes icon-spin {
  to {
    transform: rotateZ(360deg);
  }
  50% {
    transform: rotateZ(180deg);
  }
  from {
    transform: rotateZ(0deg);
  }
}
</style>
