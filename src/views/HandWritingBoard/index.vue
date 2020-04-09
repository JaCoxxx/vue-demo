<template>
  <div class="hand-writing">
    <img v-if="filePath" :src="filePath" alt="" />
    <canvas
      v-else
      ref="writingCanvas"
      class="writing-box"
      :width="canvasWidth"
      :height="canvasHeight"
      @touchstart="onStart"
      @touchmove="onMove"
      @touchend="onEnd"
    >
    </canvas>
    <div class="btn-box">
      <div class="btn btn-clear" @click="onClear">清屏</div>
      <div class="btn btn-generate" @click="onGenerate">生成</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HandWriting",
  props: {
    path: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      // 画板坐标
      offsetWidth: 0,
      offsetHeight: 0,
      // 画板宽度
      canvasWidth: 500,
      // 画板高度
      canvasHeight: 500,
      // 线条宽度
      lineWidth: 10,
      // 线条颜色
      lineColor: "#000",
      // 图片地址
      filePath: "",
      // 辅助坐标
      c1px: 0,
      c1py: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 画板初始化
    init() {
      // 获取canvas
      const canvas = this.$refs.writingCanvas;
      this.canvasWidth = canvas.offsetWidth;
      this.canvasHeight = canvas.offsetHeight;
      // 获取context对象
      this.ctx = canvas.getContext("2d");
      if (this.path !== "") {
        this.filePath = this.path;
      }
    },
    handleDraw(e) {
      // 获取点击点的坐标
      let x = e.touches[0].clientX - this.offsetLeft;
      let y = e.touches[0].clientY - this.offsetTop;
      // 绘制
      this.ctx.moveTo(this.c1px, this.c1py);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.c1px = x;
      this.c1py = y;
    },
    // 开始触摸
    onStart(e) {
      // 获取偏移量
      this.offsetLeft = e.target.offsetLeft;
      this.offsetTop = e.target.offsetTop;
      this.ctx.beginPath();
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.strokeStyle = this.lineColor;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.c1px = e.touches[0].clientX - this.offsetLeft;
      this.c1py = e.touches[0].clientY - this.offsetTop;
      this.handleDraw(e);
    },
    // 移动
    onMove(e) {
      this.handleDraw(e);
    },
    // 停止触摸
    onEnd() {
      this.ctx.closePath();
    },
    // 点击取消
    onClear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.filePath = "";
      this.$nextTick(() => {
        this.init();
      });
      // 清除的回调
      this.$emit("onClear");
    },
    // 点击确认
    onGenerate() {
      if (this.filePath) {
        this.filePath = this.filePath;
      } else {
        this.filePath = this.$refs.writingCanvas.toDataURL();
        // 生成图片的回调
        this.$emit("onComplete", this.filePath);
      }
    }
  }
};
</script>

<style lang="css" scoped>
.hand-writing {
    width: 100%;
    height: 100%;
    background: #fff;
}

.writing-box {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 80%;
    background: #ccc;
}
.btn-box {
  margin: 0 auto;
  width: 300px;
  height: 20%;
}
.btn {
  box-sizing: border-box;
  margin: 20px 25px;
  display: inline-block;
  width: 100px;
  height: 50px;
  border: 1px solid #1890ff;
  border-radius: 10px;
  background: #1890ff;
  color: #fff;
  text-align: center;
  line-height: 50px;
}

.btn:active {
  background: #fff;
  color: #000;
}
</style>
