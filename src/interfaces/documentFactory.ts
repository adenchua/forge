import { Derivatives } from "./derivatives";
import { Schema } from "./schema";

export interface Recipe {
  schema: Schema;
  derivatives?: Derivatives;
  keysToDelete?: string[];
}

export interface Config {
  recipe: Recipe;
  references?: object;
  globalNullablePercentage: number;
}
