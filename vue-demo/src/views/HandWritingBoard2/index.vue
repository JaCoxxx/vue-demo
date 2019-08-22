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
      <!-- 调节弹框 -->
      <a-popover v-model="adjustVisible">
        <template slot="title">
          <div class="adjust-header">
            <span>调节笔画</span>
            <a-icon type="close-circle" @click="adjustVisible = false" />
          </div>
        </template>
        <template slot="content">
          <div class="adjust-content">
            <a-row>
              <a-col :span="8">线条粗细</a-col>
              <a-col :span="16">
                <a-slider :min="1" :max="20" v-model="lineWidth" />
              </a-col>
            </a-row>
            <chrome-picker v-model="pickerColor" />
          </div>
        </template>
        <a-button
          type="primary"
          class="btn btn-adjust"
          @click="adjustVisible = true"
        >
          调节笔画
        </a-button>
      </a-popover>

      <a-button type="primary" class="btn btn-clear" @click="onClear"
        >清屏</a-button
      >
      <a-button type="primary" class="btn btn-generate" @click="onGenerate"
        >生成</a-button
      >
    </div>
  </div>
</template>

<script>
import { Chrome } from "vue-color";
export default {
  name: "HandWriting",
  props: {
    path: {
      type: String,
      default: ""
    }
  },
  components: {
    "chrome-picker": Chrome
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
      // 调色板颜色
      pickerColor: {},
      // 线条颜色
      lineColor: "#000",
      // 图片地址
      filePath: "",
      // 辅助坐标
      c1px: 0,
      c1py: 0,
      adjustVisible: false
    };
  },
  watch: {
    pickerColor: function(now) {
      console.log(now, this);
      this.lineColor = now.hex8;
    }
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
}
.btn-box {
  border-top: 1px solid #000;
  margin: 0 auto;
  padding-top: 10px;
  height: 20%;
}
.btn {
  margin: 0 15px;
  width: 100px;
  height: 50px;
  line-height: 50px;
}

.adjust-header {
    display: flex;
}

.adjust-header span {
    flex: 1;
}

.adjust-header .anticon{
    flex: 1;
    text-align: right;
    line-height: 21px;
}
.ant-row {
    line-height: 36px;
}
</style>
