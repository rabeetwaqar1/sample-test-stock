import StockChecker from "../index";
import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
import { getFileContent, validateFileContent, validateSku } from "../helpers";
const stockChecker = new StockChecker();
const GIVEN_SKU = "LTV719449/39/39";

describe("it should validate the given sku is provided in string or not", () => {
  test("it should validate the given sku is provided in string or not", () => {
    expect(validateSku(GIVEN_SKU)).toBe(true);
  });
});

describe("it should validate the STOCK file content must be present", () => {
  test("if the file contains the json and must not empty", async () => {
    expect(await getFileContent(process.env?.STOCK_FILE)).toBeDefined();
  });
});

describe("it should validate the TRANSACTIONS file content must be present", () => {
  test("if the file contains the json and must not empty", async () => {
    expect(await getFileContent(process.env?.TRANSACTIONS_FILE)).toBeDefined();
  });
});

describe("it should validate this method should return SUCCESS", () => {
  test("it should validate this method should return SUCCESS", async () => {
    expect(await stockChecker.run(GIVEN_SKU)).toBe("SUCCESS");
  });
});

describe("it should validate that the STOCK FILE must contain an array and content is present", () => {
  test("it should validate that the STOCK FILE must return boolean true", () => {
    expect(validateFileContent(stockChecker.getStockFileContent())).toBe(true);
  });
});

describe("it should validate that the TRANSACTIONS FILE must contain an array and content is present", () => {
  test("it should validate that the TRANSACTIONS FILE must return boolean true", () => {
    expect(validateFileContent(stockChecker.getTransFileContent())).toBe(true);
  });
});

describe("it should validate the STOCK-FILE-CONTENT stockObject is found for the given sku", () => {
  test("it should validate the stockObject is found for the given sku", () => {
    expect(stockChecker.getStock()).toBeInstanceOf(Object);
  });
});

describe("it should validate the TRANSCTIONS-FILE-CONTENT transactions are found for the given sku", () => {
  test("it should validate the transactions are found for the given sku", () => {
    expect(stockChecker.getTransactions()).toBeInstanceOf(Array);
  });
});

describe("it should return the current stock level for the given sku", () => {
  test(`it should return the current stock level for the given sku -> ${GIVEN_SKU}`, () => {
    console.log(
      `Current Stock Level For GIVEN_SKU(${GIVEN_SKU})`,
      stockChecker.getCurrentStockLevel()
    );
    expect(stockChecker.getCurrentStockLevel()).toBeDefined();
  });
});
