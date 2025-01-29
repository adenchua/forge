import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { COMPRESSION_LEVEL, zip } from "zip-a-folder";

export async function zipFolder(srcDir: string, destDir: string, fileType = "zip") {
  await zip(srcDir, `${destDir}.${fileType}`, { compression: COMPRESSION_LEVEL.high });
}

export function chunkArray(list: object[], chunkSize: number) {
  const result = [...Array(Math.ceil(list.length / chunkSize))].map(() =>
    list.splice(0, chunkSize),
  );
  return result;
}

export function createDirectory(outputDir: string) {
  // if folder doesn't exist, create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

export async function saveAsJsonLine(documents: object[], destFilepath: string) {
  for (const document of documents) {
    await fsPromises.appendFile(destFilepath, JSON.stringify(document) + "\n", "utf8");
  }
}

export async function saveDocuments(destDir: string, documents: object[]) {
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
