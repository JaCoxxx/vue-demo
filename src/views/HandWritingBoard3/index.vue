<template>
  <div ref="box" class="hand-writing">
    <div v-if="!app" style="height: 100%">
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
      <div
        class="menu-box"
        :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }"
        @touchstart="onMenuStart($event)"
        @touchmove="onMenuMove($event)"
        @touchend="onMenuEnd($event)"
      >
        <div :class="{ 'list-show': menuShow }" class="menu-list">
          <div
            :class="{ 'btn-checked': menuShow }"
            class="menu-btn"
            @click="onClickMenuBtn"
          >
            <span class="menu-btn-item"></span>
            <span class="menu-btn-item"></span>
            <span class="menu-btn-item"></span>
          </div>
          <div
            :class="{ 'item-checked': mouseStatus === 'brush' }"
            class="list-item"
          >
            <a-popover
              v-model="adjustVisible"
              placement="right"
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
              <a-icon type="edit" @click="onClickEdit" />
            </a-popover>
          </div>
          <div
            :class="{ 'item-checked': mouseStatus === 'eraser' }"
            class="list-item"
          >
            <a-popover
              v-model="eraserVisible"
              placement="right"
              :arrowPointAtCenter="true"
              :getPopupContainer="handleGetContainer"
            >
              <template slot="title">
                <div class="adjust-header">
                  <span>调节橡皮擦</span>
                  <a-icon type="close-circle" @click="eraserVisible = false" />
                </div>
              </template>
              <template slot="content">
                <div class="adjust-content">
                  <a-row>
                    <a-col :span="8">橡皮宽度</a-col>
                    <a-col :span="16">
                      <a-slider :min="1" :max="50" v-model="eraserWidth" />
                    </a-col>
                  </a-row>
                </div>
              </template>
              <icon-font type="icon-eraser" @click="onClickEraser" />
            </a-popover>
          </div>
          <div class="list-item"><a-icon type="undo" @click="onUndo" /></div>
          <div class="list-item">
            <a-icon type="redo" @click="onReduction" />
          </div>
          <div class="list-item"><a-icon type="delete" @click="onClear" /></div>
          <div class="list-item">
            <a-icon type="save" @click="onGenerate" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>暂不支持QQ浏览器,请选择其他浏览器打开。</div>
  </div>
</template>

<script>
import { Chrome } from "vue-color";
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1372570_awwwx5suzr.js"
});
export default {
  name: "HandWriting",
  props: {
    path: {
      type: String,
      default: ""
    }
  },
  components: {
    IconFont,
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
      // 橡皮擦宽度
      eraserWidth: 10,
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
      eraserVisible: false,
      // 鼠标状态: brush eraser
      mouseStatus: "brush",
      // 绘画状态
      boardData: [],
      boardStatus: 0,
      // 菜单相关
      menuShow: false,
      menuTop: 0,
      menuLeft: 0,
      menuX: 0,
      menuY: 0
    };
  },
  watch: {
    pickerColor: function(now) {
      this.lineColor = now.hex8;
    }
  },
  computed: {
    app() {
      if (navigator.userAgent.includes("QQBrowser")) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 画板初始化
    init() {
      this.mouseStatus = "brush";
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
      if (this.mouseStatus) {
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
      } else {
        this.$message.info("请先选择画笔");
      }
    },
    handleDraw(e) {
      // 获取点击点的坐标
      let x = e.touches[0].clientX - this.offsetLeft;
      let y = e.touches[0].clientY - this.offsetTop - 38;
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
      this.c1py = e.touches[0].clientY - this.offsetTop - 38;
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
      this.mouseStatus = "";
    },

    // 橡皮擦移动开始
    onEraserStart(e) {
      this.offsetLeft = e.target.offsetLeft;
      this.offsetTop = e.target.offsetTop;
      this.c1px = e.touches[0].clientX - this.offsetLeft;
      this.c1py = e.touches[0].clientY - this.offsetTop - 38;
      this.clearArc(this.c1px, this.c1py, this.eraserWidth / 2);
      // this.clearArc(e, this.lineWidth / 2);
    },
    onEraserMove(e) {
      this.clearLine(e, this.eraserWidth / 2);
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
      let endY = e.touches[0].clientY - this.offsetTop - 38;
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
      if (this.boardStatus < this.boardData.length - 1) {
        this.boardData = this.boardData.slice(0, this.boardStatus + 1);
      }
      this.boardData.push(data);
      this.boardStatus += 1;
    },

    // 展开菜单
    onClickMenuBtn() {
      this.menuShow = !this.menuShow;
    },
    // 菜单移动三部曲
    onMenuStart(e) {
      this.menuX = e.touches[0].clientX;
      this.menuY = e.touches[0].clientY;
    },
    onMenuMove(e) {
      this.menuShow = false;
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      this.menuTop += y - this.menuY;
      this.menuLeft += x - this.menuX;
      let _data = this.handleBorderJudgment(this.menuLeft, this.menuTop);
      this.menuTop = _data.top;
      this.menuLeft = _data.left;
      this.menuX = x;
      this.menuY = y;
    },
    onMenuEnd() {
      //   console.log("object");
    },
    // 移动边界判断
    handleBorderJudgment(left, top) {
      if (left < 0) {
        left = 0;
      } else if (left > this.canvasWidth - 35) {
        left = this.canvasWidth - 35;
      }
      if (top < 0) {
        top = 0;
      } else if (top > this.canvasHeight - 27) {
        top = this.canvasHeight - 27;
      }
      return {
        left,
        top
      };
    },
    // 点击画笔
    onClickEdit() {
      this.adjustVisible = true;
      this.mouseStatus = "brush";
    },
    // 点击橡皮
    onClickEraser() {
      this.eraserVisible = true;
      this.mouseStatus = "eraser";
    }
  }
};
</script>

<style lang="css" scoped>
.hand-writing {
    position: relative;
    width: 100%;
    height: calc(100vh - 38px);
    background: #fff;
    overflow: hidden;
}

.writing-box {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
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
  position: fixed;
  top: 38px;
  left: 60px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.picker-box .picker-cancel {
  float: right;
  height: 20px;
  line-height: 20px;
}

.picker-box .vc-chrome {
  box-shadow: 0 0 0;
}

/* 伸缩菜单 */
.menu-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: auto;
    height: auto;
    background: #fff;
}

.menu-box div.list-show {
    height: 100%;
    padding-bottom: 10px;
}

.menu-box .menu-list {
    padding-bottom: 10px;
    width: 35px;
    height: 27px;
    border: 1px solid #000;
    border-radius: 5px;
    text-align: center;
    overflow: hidden;
}

.menu-box .menu-list .menu-btn {
    display: inline-block;
    width: 20px;
    height: 100%;
    /* padding: 1px 0; */
    line-height: 3px;
}
.menu-box .menu-list .menu-btn .menu-btn-item {
    display: inline-block;
    width: 20px;
    height: 2px;
    background: #666;
    border-radius: 5px;
    transition: transform .5s;
}

.btn-checked .menu-btn-item:first-child {
    transform: translateY(7px) rotate(45deg);
}
.menu-box .menu-list .btn-checked .menu-btn-item:nth-child(2) {
    display: none;
}
.btn-checked .menu-btn-item:last-child {
    transform: rotate(-45deg);
}
.menu-box .menu-list .list-item {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 5px;
    margin-top: 5px;
}
.item-checked {
    border: 1px solid #000;
}
</style>
