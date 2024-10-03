import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import ConfigValidator from "./ConfigValidatorClass.js";
import DocumentFactory from "./DocumentFactoryClass.js";
import { getTodayDate } from "./utils/dateUtils.js";
import { writeDocumentToDir, zipFolder } from "./utils/fileUtils.js";

async function init() {
  const uniqueFolderId = uuidv4();
  const configJson = JSON.parse(fs.readFileSync("./config/config.json"));
  const { recipeFilePath, nullablePercentage, documentCount, outputDir, references } = configJson;

  const recipeFile = JSON.parse(fs.readFileSync(recipeFilePath));
  const { schema, derivatives } = recipeFile;
  const destinationFolder = path.join(outputDir, getTodayDate(), uniqueFolderId);

  console.info(`Successfully retrieved recipe from: '${recipeFilePath}'. Performing validation...`);
  console.info("-----------------------------------------------------------------------------");
  console.info("Errors found:");
  const validator = new ConfigValidator(schema, derivatives, references);
  validator.validateSchema();
  validator.validateDerivatives();
  const isValidRecipe = validator.getValidity();
  console.info("-----------------------------------------------------------------------------");

  if (!isValidRecipe) {
    console.error("Something is wrong with the provided recipe, exiting program...");
    return;
  }

  console.info(
    `Validation successful! Generating ${documentCount} documents to ${destinationFolder}`,
  );

  for (let i = 0; i < documentCount; i++) {
    const newDocument = new DocumentFactory(
      schema,
      nullablePercentage,
      references,
      derivatives,
    ).getDocument();
    writeDocumentToDir(destinationFolder, newDocument);
  }

  // zip and delete folder afterwards
  await zipFolder(destinationFolder, `${destinationFolder}`);
  fs.rmSync(destinationFolder, { recursive: true, force: true });

  console.info(`Successfully generated ${documentCount} documents!`);
}

init();
