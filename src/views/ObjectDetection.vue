<template>
  <div class="object-detection">
    <WebCam />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import WebCam from "@/components/webcam/WebCam.vue";

export default Vue.extend({
  name: "objectDetection",
  components: {
    WebCam,
  },
});
</script>
