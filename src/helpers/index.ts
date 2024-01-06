import fs from "fs/promises";
import path from "path";

export const getFileContent = async (filename: any) => {
  const content =
    (await fs.readFile(path.resolve(filename)).catch((err) => {
      throw new Error(`${filename} - Error (${err})`);
    })) || null;

  return content ? JSON.parse(content?.toString()) : null;
};

export const validateFileContent = (
  content: object | string | null | undefined
) => {
  if (!content) return false;
  if (!Array.isArray(content)) return false;
  return true;
};
