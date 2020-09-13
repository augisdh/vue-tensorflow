const fs = require("fs");
const path = require("path");
// const tfnode = require("@tensorflow/tfjs-node");
const tfnode = require("@tensorflow/tfjs-node-gpu");
// require("@tensorflow/tfjs-backend-cpu");
// require("@tensorflow/tfjs-backend-webgl");
const cocoSsd = require("@tensorflow-models/coco-ssd");

// retrain model
// const tf = require("@tensorflow/tfjs");

let model;
let modelLoaded = false;

function loadImage(imagePath) {
  const image = fs.readFileSync(path.resolve(imagePath));
  return tfnode.node.decodeImage(image);
}

async function loadModel() {
  try {
    model = await cocoSsd.load();
    modelLoaded = true;
    console.log("Model loaded");
  } catch (error) {
    modelLoaded = false;
    console.error("Error", error);
  }
}

async function uploadClasification(imagePath) {
  if (!modelLoaded) await loadModel();

  const imageTensor = loadImage(imagePath);
  return await model.detect(imageTensor);
}

async function retrainModel() {
  console.log("re train model");
}

module.exports = {
  uploadClasification,
  retrainModel,
};
