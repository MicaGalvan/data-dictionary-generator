# VisualVault Data Dictionary Generator

This project is a utility tool designed to automate the process of creating the Data Dictionary from VV Forms.
<br/><br/>

## Data Dictionary Example Structure


| VV TABLE NAME  |   VV FIELD NAME    | VV DB DATA TYPE | VV FORM DATA TYPE 
| -------------- | ------------------ | --------------- | ---------------- 
| Patient Record | Patient First Name |     nvarchar    | Textbox Control    
| Patient Record |       DP DOB       |     datetime    | Calendar Control   


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
- `.env`: This file must have the same structure as the ".env.example" file.

You can create these folders & files manually or use the following commands:

```
mkdir public
mkdir public/input
mkdir public/output
copy .env.example .env
```
### 4. Configure the .env file

Before running the application, make sure to configure the .env file with your configuration settings.

## 🛠️ How To Use

1. Export the template xml files of the forms for which you want to generate information from the VisualVault environment.
2. Place all the xml files in the input path `/public/input`.
3. Open your terminal or command prompt and navigate to the directory where your project is located.
4. Once you are in the project directory, run the command `npm start`.
