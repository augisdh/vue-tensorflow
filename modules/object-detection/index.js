const fs = require("fs");
const path = require("path");
const tfnode = require("@tensorflow/tfjs-node");
require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
const cocoSsd = require("@tensorflow-models/coco-ssd");

let model;

function loadImage(imagePath) {
  const image = fs.readFileSync(path.resolve(imagePath));
  return tfnode.node.decodeImage(image);
}

async function loadModel() {
  model = await cocoSsd.load();
  console.log("Model loaded");
}

async function runClasification(imagePath) {
  const imageTensor = loadImage(imagePath);
  return await model.detect(imageTensor);
}

module.exports = {
  runClasification,
  loadModel,
};
