import { Derivatives } from "../interfaces/derivatives";
import { Config, Recipe } from "../interfaces/documentFactory";
import { deleteKeysFromObject } from "../utils/objectUtils";
import DerivativesParser from "./DerivativesParser";
import SchemaParser from "./SchemaParser";

export default class DocumentFactory {
  private recipe: Recipe;
  private references: object;
  private globalNullablePercentage: number;
  private document: object;

  constructor(config: Config) {
    const { recipe, references, globalNullablePercentage } = config;
    this.recipe = recipe;
    this.references = references ?? {};
    this.globalNullablePercentage = globalNullablePercentage;
  }

  generateDocument() {
    this.processSchema();

    const { derivatives, keysToDelete } = this.recipe;

    // if derived keys are defined, process derivatives
    if (derivatives != null) {
      this.processDerivatives(derivatives);
    }

    // if keys to delete array is defined, process key deletion
    if (keysToDelete != null) {
      this.processKeyDeletion(keysToDelete);
    }
  }

  private processSchema() {
    const { schema } = this.recipe;
    const schemaParser = new SchemaParser(schema, this.globalNullablePercentage, this.references);
    schemaParser.init();
    this.document = schemaParser.getOutput();
  }

  private processDerivatives(derivatives: Derivatives) {
    const derivativeParser = new DerivativesParser(
      derivatives,
      this.globalNullablePercentage,
      this.document,
    );
    derivativeParser.init();
    this.document = derivativeParser.getOutput();
  }

  private processKeyDeletion(keysToDelete: string[]) {
    this.document = deleteKeysFromObject(this.document, keysToDelete);
  }

  getDocument() {
    return this.document;
  }
}
