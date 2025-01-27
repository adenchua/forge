import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import ConfigValidator from "./classes/ConfigValidator";
import DocumentFactory from "./classes/DocumentFactory";
import { Config } from "./interfaces/documentFactory";
import { getTodayDate } from "./utils/dateUtils";
import { writeDocumentToDir, zipFolder } from "./utils/fileUtils";

async function init() {
  const uniqueFolderId = uuidv4();
  const configJson = JSON.parse(fs.readFileSync("./config/config.json", { encoding: "utf8" }));
  const { recipeFilePath, nullablePercentage, documentCount, outputDir, references } = configJson;

  const recipeFile = JSON.parse(fs.readFileSync(recipeFilePath, { encoding: "utf8" }));
  const { schema, derivatives, keysToDelete } = recipeFile;
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

  const config: Config = {
    globalNullablePercentage: nullablePercentage,
    recipe: recipeFile,
    references: references,
  };

  for (let i = 0; i < documentCount; i++) {
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const document = documentFactory.getDocument();
    console.log(document);

    writeDocumentToDir(destinationFolder, document);
  }

  // zip and delete folder afterwards
  await zipFolder(destinationFolder, `${destinationFolder}`);
  fs.rmSync(destinationFolder, { recursive: true, force: true });

  console.info(`Successfully generated ${documentCount} documents!`);
}

init();
