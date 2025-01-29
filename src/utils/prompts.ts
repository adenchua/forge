import { number, select } from "@inquirer/prompts";
import fs from "fs";
import path from "path";
import { Recipe } from "../interfaces/core";
import { SchemaReference } from "../interfaces/schema";

/** Prompt the user to select a recipe */
export async function runRecipeSelectionPrompt(): Promise<Recipe> {
  const filenames = fs.readdirSync("recipes");
  const recipeFilepathInput = await select({
    message: "Select a recipe:",
    choices: filenames.map((filename) => {
      return {
        name: filename,
        value: filename,
      };
    }),
  });

  const recipeFilepath = path.join("recipes", recipeFilepathInput);
  const result = JSON.parse(fs.readFileSync(recipeFilepath, { encoding: "utf-8" })) as Recipe;

  return result;
}

/** Prompt the user to select a reference */
export async function runReferenceSelectionPrompt(): Promise<SchemaReference> {
  const filenames = fs.readdirSync("references");
  const filepathInput = await select({
    message: "Select a reference:",
    choices: filenames.map((filename) => {
      return {
        name: filename,
        value: filename,
      };
    }),
  });

  const referenceFilepath = path.join("references", filepathInput);
  const result = JSON.parse(
    fs.readFileSync(referenceFilepath, { encoding: "utf-8" }),
  ) as SchemaReference;

  return result;
}

/** Prompts the user to select a global nullable percentage */
export async function runGlobalNullablePercentagePrompt(): Promise<number> {
  const DEFAULT: number = 0;
  const answer =
    (await number({
      required: true,
      default: DEFAULT,
      min: 0,
      max: 1,
      message:
        "Select a global nullable percentage (0.0 ~ 1.0). Properties with 'isNullable' set to 'true' will have this percentage to be null",
    })) || DEFAULT;

  return answer;
}

/** Prompts the user to select the number of documents to generate */
export async function runDocumentCountPrompt(): Promise<number> {
  const DEFAULT: number = 10;
  const answer =
    (await number({
      required: true,
      min: 1,
      default: DEFAULT,
      message: "Select the number of documents to generate",
    })) || DEFAULT;

  return answer;
}
