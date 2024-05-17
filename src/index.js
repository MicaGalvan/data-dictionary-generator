require("dotenv").config();
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const fixFields = require("./fieldFixers");

/* -------------------------------------------------------------------------- */
/*                              CONFIG VARIABLES                              */
/* -------------------------------------------------------------------------- */

// XML file paths
const inputXmlFolderPath = "./public/input/";

// Load desired field types from .env file or use default values
const desiredFieldTypes = process.env.DESIRED_FIELD_TYPES;
const outputExcelName = process.env.OUTPUT_EXCEL_NAME;

/* -------------------------------------------------------------------------- */
/*                                FILE HANDLING                               */
/* -------------------------------------------------------------------------- */

function getAllXMLFilePaths(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            // Filter out non-XML files
            const xmlFiles = files.filter((file) => file.endsWith(".xml"));
            resolve(xmlFiles);
        });
    });
}

function readXmlFile(inputXmlPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(inputXmlPath, "utf-8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

function convertXmlToJson(data) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(data, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

async function processXmlFile(filePath) {
    const data = await readXmlFile(path.join(inputXmlFolderPath, filePath));
    const fileName = path.basename(filePath, ".xml");
    const jsonData = await convertXmlToJson(data);
    const formEntity = jsonData.FormEntity;

    // Extract fields using fixFields function
    return fixFields(formEntity, desiredFieldTypes, fileName);
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main() {
    try {
        const filePaths = await getAllXMLFilePaths(inputXmlFolderPath);
        const allFields = [];

        for (const filePath of filePaths) {
            // eslint-disable-next-line no-await-in-loop
            const fields = await processXmlFile(filePath);
            allFields.push(...fields);
        }

        // Generate the Excel file with all accumulated fields
        fixFields.generateExcelFile(outputExcelName, allFields);

        console.log("All files have been processed!");
    } catch (error) {
        console.log(error);
    }
}

main();
