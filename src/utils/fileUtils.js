import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { COMPRESSION_LEVEL, zip } from "zip-a-folder";

export function writeDocumentToDir(outputDir, jsonDocument) {
  // if folder doesn't exist, create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const uniqueFileId = uuidv4();
  const outputPath = path.join(outputDir, `${Date.now()}-${uniqueFileId}.json`);

  const stringifiedDocument = JSON.stringify(jsonDocument);
  fs.writeFileSync(outputPath, stringifiedDocument, "utf8");
}

export async function zipFolder(srcDir, destDir, fileType = "zip") {
  await zip(srcDir, `${destDir}.${fileType}`, { compression: COMPRESSION_LEVEL.high });
}
