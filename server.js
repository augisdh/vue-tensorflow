const express = require("express");
const cors = require("cors");
const http = require("http");
const multer = require("multer");
const crypto = require("crypto");
const { runClasification } = require("./modules/object-detection/index");
const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: "./uploads/images/",
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      cb(null, file.originalname);
    });
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) return res.send("File not found!");

  return res.json(await runClasification(req.file.path));
});

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running: localhost:${PORT}`));
