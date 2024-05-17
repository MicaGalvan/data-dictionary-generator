/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* -------------------------------------------------------------------------- */
/*                              GLOBAL VARIABLES                              */
/* -------------------------------------------------------------------------- */

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

function fixFields(form) {
  try {
    form.FormPages.forEach((page, pageIndex) => {
      const fields = getPageFields(form, pageIndex);

      // Iterate over each field in the page
      fields.forEach((field, fieldIndex) => {
        const fieldType = field.$["xsi:type"];

        const fieldName = getFieldName(form, pageIndex, fieldIndex);
        console.log(`${fieldName} : ${fieldType}`);
      
      });
    });
  } catch (error) {
    console.log(error);
  }
  return form;
}

module.exports = fixFields;
