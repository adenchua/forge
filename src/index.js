import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { COMPRESSION_LEVEL, zip } from "zip-a-folder";

import configJson from "../config/config.json" assert { type: "json" };
import ConfigValidator from "./ConfigValidatorClass.js";
import DocumentFactory from "./DocumentFactoryClass.js";

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

async function zipFolder(srcDir, destDir) {
  await zip(srcDir, destDir, { compression: COMPRESSION_LEVEL.high });
}

async function init() {
  const uniqueFolderId = uuidv4();
  const { schemaPath, nullablePercentage, documentCount, outputDir, references } = configJson;
  const schemaFile = JSON.parse(fs.readFileSync(schemaPath));
  const { schema, derivatives } = schemaFile;
  const targetFolder = path.join(outputDir, getTodayDate(), uniqueFolderId);

  console.info(`Successfully retrieved schema from: '${schemaPath}'. Performing validation...`);
  console.info("-----------------------------------------------------------------------------");
  console.info("Errors found:");
  const validator = new ConfigValidator(schema, derivatives, references);
  validator.validateSchema();
  validator.validateDerivatives();
  const isValidSchema = validator.getValidity();
  console.info("-----------------------------------------------------------------------------");

  if (!isValidSchema) {
    console.error("Something is wrong with the provided schema, exiting program...");
    return;
  }

  console.info(
    `Validation successful! Generating ${documentCount} documents to ${targetFolder}.zip`,
  );

  for (let i = 0; i < documentCount; i++) {
    const newDocument = new DocumentFactory(
      schema,
      nullablePercentage,
      references,
      derivatives,
    ).getDocument();
    writeDocument(targetFolder, newDocument);
  }

  // zip and delete folder afterwards
  await zipFolder(targetFolder, `${targetFolder}.zip`);
  fs.rmSync(targetFolder, { recursive: true, force: true });

  console.info(`Successfully generated ${documentCount} documents!`);
}

init();
