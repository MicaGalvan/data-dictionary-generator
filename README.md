# VisualVault Data Dictionary Generator

This project is a utility tool designed to automate the process of creating the Data Dictionary from VV Forms.
<br/><br/>

## Data Dictionary Example Structure


| VV TABLE NAME  |   VV FIELD NAME    | VV DB DATA TYPE | VV FORM DATA TYPE | VV META DATA
| -------------- | ------------------ | --------------- | ----------------- | --------
| Patient Record | Patient First Name |     nvarchar    | Textbox Control   | No
| Patient Record |       DP DOB       |     datetime    | Calendar Control  | No


### Notes:

## 🚀 Getting Started

To get started with the VisualVault Data Dictionary Generator, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```
git clone https://github.com/MicaGalvan/data-dictionary-generator.git
```

### 2. Install Required Modules

Navigate to the project directory and install the required modules by running the following command:

```
npm install
```

### 3. Create Folders & Files

Create the following folders inside the project directory:

- `public`: This folder will contain any public assets or files that need to be served.
- `public/input`: This folder will contain the XML files that need to be processed.
- `public/output`: This folder will store the processed XML files and the markdown reports.
- `public/dataDictionary`: This folder will contain the older data dictionary for comparison with the new one.
- `.env`: This file must have the same structure as the ".env.example" file.

You can create these folders & files manually or use the following commands:

```
mkdir public
mkdir public/input
mkdir public/output
mkdir public/dataDictionary
copy .env.example .env
```
### 4. Configure the .env file

Before running the application, make sure to configure the .env file with your configuration settings.

## 🛠️ How To Use

### Generate Data Dictionary
1. Export the template xml files of the forms for which you want to generate information from the VisualVault environment.
2. Place all the xml files in the input path `/public/input`.
3. Open your terminal or command prompt and navigate to the directory where your project is located.
4. Once you are in the project directory, run the command `npm start`.

### Compare Data Dictionary Files
1. Place the new generated Excel file in the `public/output` folder, with the same name as the value of <b>DESIRED_FIELD_TYPES</b> in the .env file.
2. Place the older data dictionary Excel file in the `public/dataDictionary` folder, with the same name as the value of <b>DESIRED_FIELD_TYPES</b> in the .env file.
3. Open your terminal or command prompt and navigate to the directory where your project is located.
4. Once you are in the project directory, run the command `npm run compare`.

## ❗To take in to account:
1. The XML file name should be the same as the form name in VV.
2. Field types map for the `DESIRED_FIELD_TYPES` configuration variable:

    | XML FIELD TYPE      | FORM FIELD TYPE
    | ------------------- | -------------------------
    | FieldContainer      | Container
    | FieldCheckbox       | Checkbox Control
    | ImageFormControl    | Image Control
    | FieldLabel          | Label Control
    | FieldTextbox3       | Textbox Control
    | FormButton          | Form Button Control
    | FieldDropDownList3  | DropDownList Control
    | FieldTextArea3      | Multiline Textbox Control
    | CellField           | Cell Field Control
    | FieldCalendar3      | Calendar Control
    | UploadButton        | Upload Button Control
    | FormIDStamp         | Form ID Stamp Control
    | RepeatingRowControl | Repeating Row Control
    | FieldDataGrid       | Data Grid Control
    | UserIDStamp         | Signature Stamp Control
    | QuestionsControl    | Question Control
    | SumField            | Sum Field Control
    | FieldRectangle      | Rectangle
    | FieldCommentList    | Conversation
    | FieldSlider         | Slider Control
    | BarCodeFormControl  | Barcode Image

## 📝 Output Explanation

### Data Dictionary Generation

- The generated Excel file will have the following columns:
  - VV TABLE NAME / RECORD TYPE
  - VV FIELD NAME
  - VV DB DATA TYPE
  - VV FORM DATA TYPE
  - VV META DATA

### Data Dictionary Comparison

- The comparison output will be saved in `public/output/differences.xlsx`.
- The differences Excel file will have the following columns:
  - VV TABLE NAME / RECORD TYPE
  - VV FIELD NAME
  - VV DB DATA TYPE
  - VV FORM DATA TYPE
  - VV META DATA
  - DIFFERENCE (describing what changed)