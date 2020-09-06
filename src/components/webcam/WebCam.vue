<template>
  <div class="webcam">
    <div>
      <canvas ref="canvas" class="canvas"></canvas>
      <video ref="video" id="video" :width="width" :height="height"></video>
    </div>
    <div>
      <button @click="send()">Get prediction</button>
      <button @click="stopPredictions = !stopPredictions">
        Stop predicting
      </button>
    </div>
    Stop predicting: {{ stopPredictions }}
  </div>
</template>

<style lang="scss" scoped>
.canvas {
  position: absolute;
}
</style>

<script lang="ts">
import Vue from "vue";
import { dataURItoBlob } from "@/utils/dataURItoBlob.ts";
const serverEndPoint = "http://localhost:3000/upload";

export default Vue.extend({
  name: "webcam",
  data: () => ({
    video: {} as any,
    canvas: {} as any,
    stopPredictions: true as any,
    width: 640,
    height: 480,
  }),
  mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;
    this.getWebCamAccess();
  },
  methods: {
    getWebCamAccess() {
      try {
        navigator.getUserMedia(
          { video: true },
          (stream) => {
            this.video.srcObject = stream;
            this.video.play();
          },
          (err) => {
            console.error(err);
          }
        );
      } catch (error) {
        console.error(error);
      }
    },
    takeSnapshot() {
      const hiddeCanvas = document.createElement("canvas");
      const context: any = hiddeCanvas.getContext("2d");

      hiddeCanvas.width = this.width;
      hiddeCanvas.height = this.height;

      context.drawImage(this.video, 0, 0, this.width, this.height);

      return dataURItoBlob(hiddeCanvas.toDataURL("image/jpeg"));
    },
    drawPrediction(predictions: any[]) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      const context = this.canvas.getContext("2d");
      context.clearRect(0, 0, 640, 480);
      predictions.forEach((prediction: any) => {
        context.beginPath();
        context.lineWidth = "1";
        context.rect(
          prediction.bbox[0],
          prediction.bbox[1],
          prediction.bbox[2],
          prediction.bbox[3]
        );
        context.stroke();

        context.font = "20px Arial";
        context.fillText(
          prediction.class,
          prediction.bbox[0] + 5,
          prediction.bbox[1] + 20
        );
      });
    },
    async send() {
      const file = this.takeSnapshot();
      const formData = new FormData();
      formData.append("photo", file, "screen-shot.jpg");

      try {
        const prediction = await fetch(serverEndPoint, {
          method: "POST",
          body: formData,
        }).then((response) => response.json());

        this.drawPrediction(prediction);

        if (!this.stopPredictions) {
          this.send();
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    },
  },
});
</script>
