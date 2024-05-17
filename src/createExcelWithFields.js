const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function getFieldName(form, pIndex, fieldIndex) {
  const fields = getPageFields(form, pIndex);
  const field = fields[fieldIndex];
  const fieldName = field.Name[0];
  return fieldName;
}

function getPageFields(form, pIndex) {
  return form.FormPages[pIndex].FormPage[0].FieldList[0].BaseField;
}

function fixFields(form, xmlFileName) {
  const records = [];

  try {
    form.FormPages.forEach((page, pageIndex) => {
      const fields = getPageFields(form, pageIndex);

      // Iterate over each field in the page
      fields.forEach((field, fieldIndex) => {
        const fieldType = field.$["xsi:type"];
        const fieldName = getFieldName(form, pageIndex, fieldIndex);

        // Collect data in the required format
        records.push({
          VV_TABLE_NAME: xmlFileName,
          RECORD_TYPE: "N/A",  // Adjust if you have a way to determine this
          VV_FIELD_NAME: fieldName,
          VV_DB_DATA_TYPE: "N/A", // Adjust if you have a way to determine this
          VV_FORM_DATA_TYPE: fieldType
        });
      });
    });
  } catch (error) {
    console.log(error);
  }

  return records;
}

function saveToExcel(data, outputPath) {
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  xlsx.writeFile(workbook, outputPath);
}

// Load your XML file here (assuming it's in JSON format for this example)
const xmlFilePath = 'your-xml-file.json';
const xmlFileName = path.basename(xmlFilePath, path.extname(xmlFilePath));
const form = JSON.parse(fs.readFileSync(xmlFilePath, 'utf-8'));

// Process fields and get records
const records = fixFields(form, xmlFileName);

// Save records to Excel
const outputPath = 'output.xlsx';
saveToExcel(records, outputPath);

console.log(`Data saved to ${outputPath}`);
