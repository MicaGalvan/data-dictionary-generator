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

function getFieldName(field) {
    return field.Name[0];
}

function getPageFields(page) {
    return page.FormPage[0].FieldList[0].BaseField;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

async function getXMLFields(form, desiredFieldTypes, formName) {
    const fields = [];
    let lastContainerId = null;

    try {
        // Use a single pass to find the last container ID and collect all fields
        form.FormPages.map((page) => {
            getPageFields(page).map((field) => {
                const fieldType = field.$["xsi:type"];
                const fieldName = getFieldName(field);

                if (fieldType === "FieldContainer") {
                    lastContainerId = field.ID[0];
                }

                const isMetaData = field.ContainerId && field.ContainerId[0] === lastContainerId ? "Yes" : "No";

                if (desiredFieldTypes.length === 0 || desiredFieldTypes.includes(fieldType)) {
                    fields.push({
                        name: fieldName,
                        type: fieldType,
                        formName: formName,
                        isMetaData: isMetaData,
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error processing form pages:", error);
    }

    // Get the VV DB DATA TYPE values
    const token = await getAuthToken(username, password);
    const filter = JSON.stringify([{ parameterName: "tableName", value: formName }]);
    const queryResult = await getCustomQuery(token, queryGUID, filter);
    const dbDataTypeMap = new Map(queryResult.data.map((row) => [row.column_name, row.data_type]));

    // Attach VV DB DATA TYPE and other fields to the fields
    fields.map((field) => {
        field.dbDataType = dbDataTypeMap.get(field.name) || "";
    });

    // Add extra fields to the fields array
    const extraFields = ["DhDocID", "DhID", "VVCreateDate", "VVCreateBy", "VVModifyDate", "VVModifyBy", "VVCreateByUsID", "VVModifyByUsID"];
    extraFields.map((extraField) => {
        fields.push({
            name: extraField,
            type: "",
            formName: formName,
            dbDataType: dbDataTypeMap.get(extraField) || "",
            isMetaData: "Yes",
        });
    });

    return fields;
}

function generateExcelFile(excelFileName, fields) {
    const workbook = xlsx.utils.book_new();
    const worksheetData = fields.map((field) => [
        field.formName,
        field.name,
        field.dbDataType,
        fieldTypeMapping[field.type] || "",
        field.isMetaData || "No", // Adding metadata information
    ]);

    worksheetData.unshift(["VV TABLE NAME / RECORD TYPE", "VV FIELD NAME", "VV DB DATA TYPE", "VV FORM DATA TYPE", "VV META DATA"]);

    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data Dictionary");
    xlsx.writeFile(workbook, `./public/output/${excelFileName}.xlsx`);
}

module.exports.getXMLFields = getXMLFields;
module.exports.generateExcelFile = generateExcelFile;
