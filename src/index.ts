import path from "path";
import { v4 as uuidv4 } from "uuid";

import DocumentFactory from "./classes/DocumentFactory";
import { FORGE_VERSION_NUMBER } from "./constants";
import { Config } from "./interfaces/core";
import { getTodayDate } from "./utils/dateUtils";
import { zipDocuments } from "./utils/fileUtils";
import {
  runDocumentCountPrompt,
  runGlobalNullablePercentagePrompt,
  runRecipeSelectionPrompt,
  runReferenceSelectionPrompt,
} from "./utils/prompts";
import { isValidRecipe } from "./utils/validators/recipe-validator";

(async function run() {
  console.info(`Running Forge version: ${FORGE_VERSION_NUMBER}...`);
  const recipe = await runRecipeSelectionPrompt();
  const references = await runReferenceSelectionPrompt();
  const documentCount = await runDocumentCountPrompt();
  const globalNullablePercentage = await runGlobalNullablePercentagePrompt();

  const { schema, derivatives } = recipe;
  const destinationDir = path.join("output", getTodayDate(), uuidv4());

  console.info(`Performing recipe and reference validation...\n`);

  if (!isValidRecipe(schema, derivatives, references)) {
    console.error("\nSomething is wrong with the provided recipe/reference, exiting program...");
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

  await zipDocuments(destinationDir, outputDocuments);
  console.info("Operation completed!");
})();
