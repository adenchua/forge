import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import configJson from "../config/config.json" assert { type: "json" };
import SchemaParser from "./SchemaParserClass.js";
import SchemaValidator from "./SchemaValidatorClass.js";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  const formattedToday = year + "-" + month + "-" + day;

  return formattedToday;
}

function writeDocument(outputDir, jsonDocument) {
  // if folder doesn't exist, create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const uniqueFileId = uuidv4();

  const outputPath = path.join(outputDir, `${Date.now()}-${uniqueFileId}.json`);
  const stringifiedDocument = JSON.stringify(jsonDocument);
  fs.writeFileSync(outputPath, stringifiedDocument, "utf8");
}

function init() {
  const uniqueFolderId = uuidv4();
  const { schemaPath, nullablePercentage, documentCount, outputDir, references } = configJson;
  const schemaFile = JSON.parse(fs.readFileSync(schemaPath));
  const { schema, derivatives } = schemaFile;
  const targetFolder = path.join(outputDir, getTodayDate(), uniqueFolderId);

  console.info(`Successfully retrieved schema from: '${schemaPath}'. Performing validation...`);
  console.info("-----------------------------------------------------------------------------");
  console.info("Errors found:");
  const validator = new SchemaValidator(schema, derivatives, references);
  validator.validateSchema();
  const isValidSchema = validator.getValidity();
  console.info("-----------------------------------------------------------------------------");

  if (!isValidSchema) {
    console.error("Something is wrong with the provided schema, exiting program...");
    return;
  }

  console.info(`Validation successful! Generating ${documentCount} documents to ${targetFolder}`);

  for (let i = 0; i < documentCount; i++) {
    const newDocument = new SchemaParser(
      schema,
      nullablePercentage,
      references,
      derivatives,
    ).getDocument();
    writeDocument(targetFolder, newDocument);
  }

  console.info(`Successfully generated ${documentCount} documents!`);
}

init();
