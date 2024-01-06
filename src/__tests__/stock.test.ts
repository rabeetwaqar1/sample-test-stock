import StockChecker from "../index";
import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
import { getFileContent, validateFileContent } from "../helpers";
const stockChecker = new StockChecker();

describe("it should validate the STOCK file content must be present", () => {
  test("if the file contains the json and must not empty", async () => {
    expect(await getFileContent(process.env.STOCK_FILE)).toBeDefined();
  });
});

describe("it should validate the TRANSACTIONS file content must be present", () => {
  test("if the file contains the json and must not empty", async () => {
    expect(await getFileContent(process.env.TRANSACTIONS_FILE)).toBeDefined();
  });
});

describe("it should validate that the STOCK FILE must contain an array and content is present", () => {
  test("it should validate that the STOCK FILE must return boolean true", async () => {
    const fileContent = await getFileContent(process.env.STOCK_FILE);
    expect(validateFileContent(fileContent)).toBe(true);
  });
});

describe("it should validate that the TRANSACTIONS FILE must contain an array and content is present", () => {
  test("it should validate that the TRANSACTIONS FILE must return boolean true", async () => {
    const fileContent = await getFileContent(process.env.TRANSACTIONS_FILE);
    expect(validateFileContent(fileContent)).toBe(true);
  });
});

describe("it should check for each MATCHED sku that the stock value must be defined", () => {
  test("it should check for each MATCHED sku that the stock value must be defined", async () => {
    await stockChecker.run();

    const matchedSkus = stockChecker.getMatchedSkus();

    matchedSkus.forEach((row: any) => {
      expect(row?.stock).toBeDefined();
    });
  });
});

describe("it should throw error for each NON-MATCHED sku", () => {
  test("it should throw an error for each NON-MATCHED sku", async () => {
    const notMatchedSkus = stockChecker.getNotMatchedSkus();

    notMatchedSkus.forEach((row: any) => {
      expect(row.error).toBe("STOCK_NOT_FOUND_FOR_TRANSACTION");
    });
  });
});
