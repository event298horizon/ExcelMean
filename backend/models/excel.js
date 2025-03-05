const mongoose = require('mongoose');

const excelSchema = new mongoose.Schema({
    data: Array
});

const Excel = mongoose.model("excel", excelSchema);

module.exports = Excel;