import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import DerivativesValidator from "./classes/DerivativesValidator";
import DocumentFactory from "./classes/DocumentFactory";
import SchemaValidator from "./classes/SchemaValidator";
import { Config, RawConfig, Recipe } from "./interfaces/core";
import { Derivatives } from "./interfaces/derivatives";
import { Schema } from "./interfaces/schema";
import { getTodayDate } from "./utils/dateUtils";
import { chunkArray, createDirectory, saveAsJsonLine, zipFolder } from "./utils/fileUtils";

function isValidRecipe(
  schema?: Schema,
  derivatives?: Derivatives,
  reference?: Record<string, any>,
): boolean {
  if (schema == undefined) {
    console.error("schema must be provided");
    return false;
  }

  if (derivatives == undefined) {
    console.error("derivatives must be provided, or left as an empty object");
    return false;
  }

  if (reference == undefined) {
    console.error("references must be provided, or left as an empty object");
    return false;
  }

  const schemaValidator = new SchemaValidator(schema, reference);
  const derivativesValidator = new DerivativesValidator(derivatives, schema);

  schemaValidator.validateSchema();
  derivativesValidator.validateDerivatives();

  const schemaValid = schemaValidator.getValidity();
  const derivativesValid = derivativesValidator.getValidity();

  return schemaValid && derivativesValid;
}

async function saveDocuments(destDir: string, documents: object[]) {
  createDirectory(destDir);

  // each file should contain at most 10,000 items
  const chunkedDocumentsList = chunkArray(documents, 10_000);
  let counter = 1;
  const filename = uuidv4();
  for (const chunkedDocuments of chunkedDocumentsList) {
    await saveAsJsonLine(chunkedDocuments, path.join(destDir, `${filename}-${counter}.jsonl`));
    counter++;
  }

  // zip and delete folder afterwards
  await zipFolder(destDir, destDir);
  fs.rmSync(destDir, { recursive: true, force: true });
}

function loadConfig(): RawConfig {
  const result = JSON.parse(
    fs.readFileSync("./configs/config.json", { encoding: "utf8" }),
  ) as RawConfig;

  return result;
}

function loadRecipe(filepath: string): Recipe {
  const result = JSON.parse(fs.readFileSync(filepath, { encoding: "utf8" })) as Recipe;

  return result;
}

async function run() {
  const { recipeFilepath, globalNullablePercentage, documentCount, references } = loadConfig();
  const recipe = loadRecipe(recipeFilepath);
  const { schema, derivatives } = recipe;
  const destinationDir = path.join("output", getTodayDate(), uuidv4());

  console.info(`Successfully retrieved recipe from: '${recipeFilepath}'. Performing validation...`);

  if (!isValidRecipe(schema, derivatives, references)) {
    console.error("Something is wrong with the provided recipe, exiting program...");
    return;
  } else {
    console.info(`Validation successful! Generating ${documentCount} documents...`);
  }

  const config: Config = {
    globalNullablePercentage,
    recipe,
    references,
  };
  const outputDocuments: object[] = [];

  for (let i = 0; i < documentCount; i++) {
    const documentFactory = new DocumentFactory(config);
    documentFactory.generateDocument();
    const document = documentFactory.getDocument();
    outputDocuments.push(document);
  }
  console.info(
    `Successfully generated ${documentCount} documents! Saving to ${destinationDir}.zip...`,
  );

  await saveDocuments(destinationDir, outputDocuments);
  console.info("Operation completed!");
}

run();
