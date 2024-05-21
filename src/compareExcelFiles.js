require("dotenv").config();
const xlsx = require("xlsx");

/* -------------------------------------------------------------------------- */
/*                              CONFIG VARIABLES                              */
/* -------------------------------------------------------------------------- */

const outputExcelName = process.env.OUTPUT_EXCEL_NAME;
// Paths to your Excel files
const excelAPath = `./public/output/${outputExcelName}.xlsx`;
const excelBPath = `./public/dataDictionary/${outputExcelName}.xlsx`;
const outputExcelPath = "./public/output/differences.xlsx";

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

// Helper function to read Excel file and convert to JSON
function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet, { header: 1 });
}

// Helper function to write data to an Excel file
function writeExcelFile(filePath, data) {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Differences");
    xlsx.writeFile(workbook, filePath);
}

// Function to compare two Excel files and get differences
function compareExcelFiles(excelAPath, excelBPath, outputExcelPath) {
    const excelAData = readExcelFile(excelAPath);
    const excelBData = readExcelFile(excelBPath);

    const differences = [];
    const headers = ["VV TABLE NAME / RECORD TYPE", "VV FIELD NAME", "VV DB DATA TYPE", "VV FORM DATA TYPE", "VV META DATA", "Source"];

    differences.push(headers);

    const dataMapA = new Map();
    const dataMapB = new Map();

    // Map data from Excel A
    excelAData.slice(1).forEach((row) => {
        const key = `${row[0]}|${row[1]}`;
        dataMapA.set(key, row);
    });

    // Map data from Excel B
    excelBData.slice(1).forEach((row) => {
        const key = `${row[0]}|${row[1]}`;
        dataMapB.set(key, row);
    });

    // Compare Excel A to Excel B
    dataMapA.forEach((row, key) => {
        if (!dataMapB.has(key)) {
            differences.push([...row, "Excel A"]);
        } else {
            const rowB = dataMapB.get(key);
            if (row[2] !== rowB[2] || row[3] !== rowB[3]) {
                differences.push([...row, "Excel A"]);
                differences.push([...rowB, "Excel B"]);
            }
        }
    });

    // Compare Excel B to Excel A
    dataMapB.forEach((row, key) => {
        if (!dataMapA.has(key)) {
            differences.push([...row, "Excel B"]);
        }
    });

    // Write differences to Excel C
    writeExcelFile(outputExcelPath, differences);
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

// Perform the comparison
compareExcelFiles(excelAPath, excelBPath, outputExcelPath);

console.log("Comparison complete. Differences saved to:", outputExcelPath);