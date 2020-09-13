const csv = require("csv-parser");
const fs = require("fs");

const fileName =
  "../dataset/open_images_v6/train-annotations-machine-imagelabels.csv";
fs.createReadStream(fileName)
  .pipe(csv())
  .on("data", (row) => {
    console.log(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });

// LABELS, IMAGE_ID, IMAGE... createDataset()
