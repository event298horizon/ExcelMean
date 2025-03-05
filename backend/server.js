const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const Excel = require("./models/excel");
const router = require("./routes/excel");

const app = express();
const port = 3000;

app.use(express.json());

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017", {
    dbName: "excelData",
  });
};

connectDB()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

const upload = multer({ dest: "uploads/" });

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
