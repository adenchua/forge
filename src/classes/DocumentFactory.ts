import { Derivatives } from "../interfaces/derivatives";
import { Config, Recipe } from "../interfaces/core";
import { Schema, SchemaReference } from "../interfaces/schema";
import { deleteKeysFromObject } from "../utils/objectUtils";
import DerivativesParser from "./DerivativesParser";
import SchemaParser from "./SchemaParser";

export default class DocumentFactory {
  private recipe: Recipe;
  private references: SchemaReference;
  private globalNullablePercentage: number;
  private document: Record<string, unknown> = {};

  constructor(config: Config) {
    const { recipe, references, globalNullablePercentage } = config;
    this.recipe = recipe;
    this.references = references ?? {};
    this.globalNullablePercentage = globalNullablePercentage;
  }

  generateDocument() {
    const { schema, derivatives, keysToDelete } = this.recipe;
    this.processSchema(schema);

    // if derived keys are defined, process derivatives
    if (derivatives != null) {
      this.processDerivatives(derivatives);
    }

    // if keys to delete array is defined, process key deletion
    if (keysToDelete != null) {
      this.processKeyDeletion(keysToDelete);
    }
  }

  private processSchema(schema: Schema) {
    const schemaParser = new SchemaParser(schema, this.globalNullablePercentage, this.references);
    schemaParser.parse();
    this.document = schemaParser.getOutput();
  }

  private processDerivatives(derivatives: Derivatives) {
    const derivativeParser = new DerivativesParser(
      derivatives,
      this.globalNullablePercentage,
      this.document,
    );
    derivativeParser.parse();
    this.document = derivativeParser.getOutput() as Record<string, unknown>;
  }

  private processKeyDeletion(keysToDelete: string[]) {
    this.document = deleteKeysFromObject(this.document, keysToDelete);
  }

  getDocument() {
    return this.document;
  }
}
