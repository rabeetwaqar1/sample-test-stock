import dotenv from "dotenv";
dotenv.config();
import { getFileContent, validateFileContent, validateSku } from "./helpers";

class StockChecker {
  private givenSku: string | null = null;
  public stockFileContent: any = null;
  public transFileContent: any = null;
  public currentStockLevel: number = 0;
  constructor() {}

  run = async (sku: string | null) => {
    try {
      this.givenSku = sku;

      if (!validateSku(this.givenSku)) {
        throw new Error("NO_SKU_FOUND");
      }

      this.stockFileContent = await getFileContent(process.env?.STOCK_FILE);

      const stockFileValidation = validateFileContent(this.stockFileContent);

      if (!stockFileValidation) {
        throw new Error(
          `${process.env.STOCK_FILE} - something went wrong reading the file content!`
        );
      }

      this.transFileContent = await getFileContent(
        process.env?.TRANSACTIONS_FILE
      );

      const transFileValidation = validateFileContent(this.transFileContent);

      if (!transFileValidation) {
        throw new Error(
          `${process.env?.TRANSACTIONS_FILE} - something went wrong reading the file content!`
        );
      }

      const stockObject = this.getSkuObject(this.stockFileContent);

      if (!stockObject) {
        throw new Error("STOCK_NOT_FOUND_FOR_GIVEN_SKU_IN_STOCKS_FILE");
      }

      const transObject = this.getSkuObject(this.transFileContent);

      if (!transObject) {
        throw new Error("STOCK_NOT_FOUND_FOR_GIVEN_SKU_IN_TRANS_FILE");
      }

      const mergedData = { ...stockObject, ...transObject };
      this.currentStockLevel = mergedData?.stock || 0;

      return "SUCCESS";
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  getCurrentStockLevel() {
    return this.currentStockLevel;
  }

  getSkuObject(fileContent: any) {
    return fileContent.find((row: { sku: (string | null)[] }) =>
      row?.sku?.includes(this.givenSku)
    );
  }

  getStockFileContent() {
    return this.stockFileContent;
  }

  getTransFileContent() {
    return this.transFileContent;
  }
}

export default StockChecker;
