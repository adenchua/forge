import { Derivatives } from "./derivatives";
import { Schema, SchemaReference } from "./schema";

export interface Recipe {
  schema: Schema;
  derivatives?: Derivatives;
  keysToDelete?: string[];
}

export interface Config {
  recipe: Recipe;
  references?: SchemaReference;
  globalNullablePercentage: number;
}

export interface RawConfig {
  recipeFilepath: string;
  globalNullablePercentage: number;
  documentCount: number;
  references: SchemaReference;
}
