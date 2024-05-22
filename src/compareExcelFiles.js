require("dotenv").config();
const xlsx = require("xlsx");

const outputExcelName = process.env.OUTPUT_EXCEL_NAME;

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
    const headers = ["VV TABLE NAME / RECORD TYPE", "VV FIELD NAME", "VV DB DATA TYPE", "VV FORM DATA TYPE", "VV META DATA", "DIFFERENCE"];

    differences.push(headers);

    const dataMapNewDictionary = new Map();
    const dataMapOriginalDictionary = new Map();

    // Map data from New Dictionary file
    excelAData.slice(1).forEach((row) => {
        const key = `${row[1]}`; // Use "VV FIELD NAME" as the unique key
        dataMapNewDictionary.set(key, row);
    });

    // Map data from Original Dictionary file
    excelBData.slice(1).forEach((row) => {
        const key = `${row[1]}`; // Use "VV FIELD NAME" as the unique key
        dataMapOriginalDictionary.set(key, row);
    });

    // Compare New Dictionary file to Original Dictionary file
    dataMapNewDictionary.forEach((newDictionary, key) => {
        if (!dataMapOriginalDictionary.has(key)) {
            differences.push([...newDictionary, "New field"]);
        } else {
            const originalDictionary = dataMapOriginalDictionary.get(key);
            let differenceDescription = "";

            if (newDictionary[1] !== originalDictionary[1]) {
                differenceDescription += `VV FIELD NAME changed from '${originalDictionary[1]}' to '${newDictionary[1]}'. `;
            }
            if (newDictionary[2].trim().toLowerCase() !== originalDictionary[2].trim().toLowerCase()) {
                differenceDescription += `VV DB DATA TYPE changed from '${originalDictionary[2]}' to '${newDictionary[2]}'. `;
            }
            if (newDictionary[3] != "" && newDictionary[3].trim().toLowerCase() !== originalDictionary[3].trim().toLowerCase()) {
                differenceDescription += `VV FORM DATA TYPE changed from '${originalDictionary[3]}' to '${newDictionary[3]}'. `;
            }
            if (newDictionary[4].trim().toLowerCase() !== originalDictionary[4].trim().toLowerCase()) {
                differenceDescription += `VV META DATA changed from '${originalDictionary[4]}' to '${newDictionary[4]}'. `;
            }

            if (differenceDescription) {
                differences.push([...newDictionary, differenceDescription]);
            }
        }
    });

    // Compare Original Dictionary to New Dictionary to find removed fields
    dataMapOriginalDictionary.forEach((row, key) => {
        if (!dataMapNewDictionary.has(key)) {
            differences.push([...row, "Removed field"]);
        }
    });

    // Write differences to new Excel file.
    writeExcelFile(outputExcelPath, differences);
}

// Paths to your Excel files
const excelAPath = `./public/output/${outputExcelName}.xlsx`;
const excelBPath = `public/dataDictionary/${outputExcelName}.xlsx`;
const outputExcelPath = "public/output/differences.xlsx";

// Perform the comparison
compareExcelFiles(excelAPath, excelBPath, outputExcelPath);

console.log("Comparison complete. Differences saved to:", outputExcelPath);
