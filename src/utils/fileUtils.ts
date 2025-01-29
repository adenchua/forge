import fs from "fs";
import fsPromises from "fs/promises";
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
