// backend/routes/excel.js
const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/import', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json(data);
});

router.post('/export', (req, res) => {
    const { data } = req.body;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const filePath = 'uploads/exported.xlsx';
    XLSX.writeFile(workbook, filePath);
    res.download(filePath);
});

module.exports = router;