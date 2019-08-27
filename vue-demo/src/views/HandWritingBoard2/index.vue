<template>
  <div ref="box" class="hand-writing">
    <img v-if="filePath" :src="filePath" alt="" />
    <canvas
      v-else
      ref="writingCanvas"
      class="writing-box"
      :width="canvasWidth"
      :height="canvasHeight"
      @touchstart="handleSelectTouch($event, 'start')"
      @touchmove="handleSelectTouch($event, 'move')"
      @touchend="handleSelectTouch($event, 'end')"
    >
    </canvas>
    <div class="btn-box">
      <!-- 调节弹框 -->
      <a-popover
        v-model="adjustVisible"
        :arrowPointAtCenter="true"
        :getPopupContainer="handleGetContainer"
      >
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
            <a-row>
              <a-col :span="8">线条颜色</a-col>
              <a-col :span="16">
                <div
                  class="color-body"
                  :style="{ background: lineColor }"
                  @click="colorVisible = true"
                ></div>
                <div class="picker-box" v-if="colorVisible">
                  <a-icon
                    class="picker-cancel"
                    type="close-circle"
                    @click="colorVisible = false"
                  />
                  <chrome-picker v-model="pickerColor" />
                </div>
              </a-col>
            </a-row>
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
      <a-button
        type="primary"
        class="btn btn-switch"
        style="padding: 0"
        @click="mouseStatus = mouseStatus === 'brush' ? 'eraser' : 'brush'"
      >
        切换为{{ mouseStatus === "brush" ? "橡皮檫" : "画笔" }}
      </a-button>
      <a-button type="primary" class="btn btn-undo" @click="onUndo">
        撤销
      </a-button>
      <a-button type="primary" class="btn btn-reduction" @click="onReduction">
        还原
      </a-button>
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
      adjustVisible: false,
      colorVisible: false,
      // 鼠标状态: brush eraser
      mouseStatus: "brush",
      // 绘画状态
      boardData: [],
      boardStatus: 0
    };
  },
  watch: {
    pickerColor: function(now) {
      this.lineColor = now.hex8;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 画板初始化
    init() {
      this.boardStatus = -1;
      this.boardData = [];
      // 获取canvas
      const canvas = this.$refs.writingCanvas;
      this.canvasWidth = canvas.offsetWidth;
      this.canvasHeight = canvas.offsetHeight;
      // 获取context对象
      this.ctx = canvas.getContext("2d");
      if (this.path !== "") {
        this.filePath = this.path;
      } else {
        this.setBoardStatus(
          this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
        );
      }
    },
    // 判断画笔属性
    handleSelectTouch(e, type) {
      let _data = this.getInitialCapital(this.mouseStatus);
      switch (type) {
        case "start":
          this[`on${_data}Start`](e);
          break;
        case "move":
          this[`on${_data}Move`](e);
          break;
        case "end":
          this[`on${_data}End`](e);
          break;
        default:
          break;
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
    onBrushStart(e) {
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
    onBrushMove(e) {
      this.handleDraw(e);
    },
    // 停止触摸
    onBrushEnd() {
      this.ctx.closePath();
      this.setBoardStatus(
        this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
      );
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
    },

    // 橡皮擦移动开始
    onEraserStart(e) {
      this.offsetLeft = e.target.offsetLeft;
      this.offsetTop = e.target.offsetTop;
      this.c1px = e.touches[0].clientX - this.offsetLeft;
      this.c1py = e.touches[0].clientY - this.offsetTop;
      this.clearArc(this.c1px, this.c1py, this.lineWidth / 2);
      // this.clearArc(e, this.lineWidth / 2);
    },
    onEraserMove(e) {
      this.clearLine(e, this.lineWidth / 2);
    },
    // 橡皮擦移动结束
    onEraserEnd() {
      this.setBoardStatus(
        this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
      );
    },
    // 画圆
    clearArc(x, y, radius) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.clip();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.restore();
    },
    // 画矩形
    clearLine(e, radius) {
      this.offsetLeft = e.target.offsetLeft;
      this.offsetTop = e.target.offsetTop;
      let endX = e.touches[0].clientX - this.offsetLeft;
      let endY = e.touches[0].clientY - this.offsetTop;
      this.clearArc(endX, endY, radius);

      // 计算辅助边长
      let sinX =
        radius * Math.sin(Math.atan((endY - this.c1py) / (endX - this.c1px)));
      let cosY =
        radius * Math.cos(Math.atan((endY - this.c1py) / (endX - this.c1px)));
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.c1px - sinX, this.c1py + cosY);
      this.ctx.lineTo(this.c1px + sinX, this.c1py - cosY);
      this.ctx.lineTo(endX + sinX, endY - cosY);
      this.ctx.lineTo(endX - sinX, endY + cosY);
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.restore();
      this.c1px = endX;
      this.c1py = endY;
    },

    // 挂载DOM
    handleGetContainer() {
      return this.$refs.box;
    },
    // 将字符串转换为首字母大写的形式
    getInitialCapital(val) {
      return val.replace(/\S/, item => item.toUpperCase());
    },
    // 撤销
    onUndo() {
      this.boardStatus--;
      if (this.boardStatus >= 0) {
        this.ctx.putImageData(this.boardData[this.boardStatus], 0, 0);
      } else {
        this.boardStatus++;
        this.$message.info("已经是第一步了");
      }
    },
    // 还原
    onReduction() {
      this.boardStatus++;
      if (this.boardStatus < this.boardData.length) {
        this.ctx.putImageData(this.boardData[this.boardStatus], 0, 0);
      } else {
        this.boardStatus--;
        this.$message.info("已经是最新的了");
      }
    },
    setBoardStatus(data) {
      this.boardData.push(data);
      this.boardStatus += 1;
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
  overflow-y: auto;
}
.btn {
  margin: 0 15px;
  width: 100px;
  height: 50px;
  line-height: 50px;
}

.adjust-header {
    display: flex;
    width: 188px;
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
.color-body {
    margin-left: 5px;
    vertical-align: sub;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #000;
}
.picker-box {
  position: absolute;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  bottom: 30px;
  left: 10px;
}
.picker-box .picker-cancel {
  float: right;
  height: 20px;
  line-height: 20px;
}

.picker-box .vc-chrome {
  box-shadow: 0 0 0;
}
</style>
