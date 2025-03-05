const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.post("/api/upload-excel", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    res.json(jsonData);
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Error processing the Excel file.");
  }
});

app.post("/api/update-cell", (req, res) => {
  const { row, col, value } = req.body;

  
  if (row === undefined || col === undefined || value === undefined) {
    return res.status(400).send("Missing required parameters.");
  }

  const filePath = "./uploads/data.xlsx";

  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const cellRef = `${String.fromCharCode(65 + col)}${row + 1}`;
    worksheet[cellRef] = { v: value };

    XLSX.writeFile(workbook, filePath);

    res.status(200).send("Cell updated successfully.");
  } catch (err) {
    console.error("Error updating cell:", err);
    res.status(500).send("Error updating the cell.");
  }
});

app.get("/api/export-excel", (req, res) => {
  const filePath = "./uploads/data.xlsx";

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Excel file not found.");
  }

  res.sendFile(filePath, { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
