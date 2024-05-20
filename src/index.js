require("dotenv").config();
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const getXMLFields = require("./generateExcelFile").getXMLFields;
const generateExcelFile = require("./generateExcelFile").generateExcelFile;

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

function getXmlFilePaths(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
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

function readXmlFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

function parseXmlToJson(xmlData) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

async function handleXmlFile(filePath) {
    const xmlData = await readXmlFile(path.join(inputXmlFolderPath, filePath));
    const formName = path.basename(filePath, ".xml");
    const jsonData = await parseXmlToJson(xmlData);
    const formEntity = jsonData.FormEntity;

    // Extract fields using getXMLFields function
    return await getXMLFields(formEntity, desiredFieldTypes, formName);
}

/* -------------------------------------------------------------------------- */
/*                                    MAIN                                    */
/* -------------------------------------------------------------------------- */

async function main() {
    try {
        const xmlFilePaths = await getXmlFilePaths(inputXmlFolderPath);
        const allFields = [];

        for (const filePath of xmlFilePaths) {
            // eslint-disable-next-line no-await-in-loop
            const fields = await handleXmlFile(filePath);
            allFields.push(...fields);
        }

        // Generate the Excel file with all accumulated fields
        generateExcelFile(outputExcelName, allFields);

        console.log("All files have been processed!");
    } catch (error) {
        console.log(error);
    }
}

main();
