import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import DerivativesValidator from "./classes/DerivativesValidator";
import DocumentFactory from "./classes/DocumentFactory";
import SchemaValidator from "./classes/SchemaValidator";
import { Derivatives } from "./interfaces/derivatives";
import { Config, Recipe } from "./interfaces/documentFactory";
import { Schema } from "./interfaces/schema";
import { getTodayDate } from "./utils/dateUtils";
import { writeDocumentToDir, zipFolder } from "./utils/fileUtils";

function isValidRecipe(
  schema: Schema,
  derivatives: Derivatives,
  reference: Record<string, any>,
): boolean {
  const schemaValidator = new SchemaValidator(schema, reference);
  const derivativesValidator = new DerivativesValidator(derivatives, schema);

  schemaValidator.validateSchema();
  derivativesValidator.validateDerivatives();

  const schemaValid = schemaValidator.getValidity();
  const derivativesValid = derivativesValidator.getValidity();

  return schemaValid && derivativesValid;
}

async function run() {
  const uniqueFolderId = uuidv4();
  const configJson = JSON.parse(fs.readFileSync("./config/config.json", { encoding: "utf8" }));
  const { recipeFilePath, nullablePercentage, documentCount, outputDir, references } = configJson;
  const recipeFile = JSON.parse(fs.readFileSync(recipeFilePath, { encoding: "utf8" })) as Recipe;
  const { schema, derivatives = {}, keysToDelete = [] } = recipeFile;
  const destinationFolder = path.join(outputDir, getTodayDate(), uniqueFolderId);
  console.info(`Successfully retrieved recipe from: '${recipeFilePath}'. Performing validation...`);

  if (!isValidRecipe(schema, derivatives, references)) {
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

run();
