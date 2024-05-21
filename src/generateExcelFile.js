const xlsx = require("xlsx");
const { getAuthToken } = require("./vvFunctions/vvAuthToken");
const { getCustomQuery } = require("./vvFunctions/vvGetCustomQuery");

/* -------------------------------------------------------------------------- */
/*                              GLOBAL VARIABLES                              */
/* -------------------------------------------------------------------------- */

const username = process.env.USER_ID;
const password = process.env.PASSWORD;
const queryGUID = process.env.QUERY_GUID;

// Field type mapping dictionary
const fieldTypeMapping = {
    FieldContainer: "Container",
    FieldCheckbox: "Checkbox Control",
    ImageFormControl: "Image Control",
    FieldLabel: "Label Control",
    FieldTextbox3: "Textbox Control",
    FormButton: "Form Button Control",
    FieldDropDownList3: "DropDownList Control",
    FieldTextArea3: "Multiline Textbox Control",
    CellField: "Cell Field Control",
    FieldCalendar3: "Calendar Control",
    UploadButton: "Upload Button Control",
    FormIDStamp: "Form ID Stamp Control",
    RepeatingRowControl: "Repeating Row Control",
    FieldDataGrid: "Data Grid Control",
    UserIDStamp: "Signature Stamp Control",
    QuestionsControl: "Question Control",
    SumField: "Sum Field Control",
    FieldRectangle: "Rectangle",
    FieldCommentList: "Conversation",
    FieldSlider: "Slider Control",
    BarCodeFormControl: "Barcode Image",
};

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function getFieldName(form, pIndex, fieldIndex) {
    const fields = getPageFields(form, pIndex);
    const field = fields[fieldIndex];
    const fieldName = field.Name[0];
    return fieldName;
}

function getPageFields(form, pIndex) {
    return form.FormPages[pIndex].FormPage[0].FieldList[0].BaseField;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

async function getXMLFields(form, desiredFieldTypes, formName) {
    const fields = [];
    try {
        form.FormPages.forEach((page, pageIndex) => {
            const pageFields = getPageFields(form, pageIndex);

            // Iterate over each field in the page
            pageFields.forEach((field, fieldIndex) => {
                const fieldType = field.$["xsi:type"];
                const fieldName = getFieldName(form, pageIndex, fieldIndex);

                if (desiredFieldTypes.length === 0 || desiredFieldTypes.includes(fieldType)) {
                    fields.push({
                        name: fieldName,
                        type: fieldType,
                        formName: formName,
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
    }

    // Get the VV DB DATA TYPE values
    const token = await getAuthToken(username, password);
    const filter = JSON.stringify([
        {
            parameterName: "tableName",
            value: formName,
        },
    ]);

    const queryResult = await getCustomQuery(token, queryGUID, filter);
    const dbDataTypeMap = {};
    queryResult.data.forEach((row) => {
        dbDataTypeMap[row.column_name] = row.data_type;
    });

    // Attach VV DB DATA TYPE to the fields
    fields.forEach((field) => {
        field.dbDataType = dbDataTypeMap[field.name] || "";
    });

    return fields;
}

function generateExcelFile(excelFileName, fields) {
    const workbook = xlsx.utils.book_new();
    const worksheetData = fields.map((field) => [field.formName, field.name, field.dbDataType, fieldTypeMapping[field.type] || field.type]);

    worksheetData.unshift(["VV TABLE NAME / RECORD TYPE", "VV FIELD NAME", "VV DB DATA TYPE", "VV FORM DATA TYPE", "VV META DATA"]);

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data Dictionary");
    xlsx.writeFile(workbook, `./public/output/${excelFileName}.xlsx`);
}

module.exports.getXMLFields = getXMLFields;
module.exports.generateExcelFile = generateExcelFile;
