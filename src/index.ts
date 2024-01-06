import dotenv from "dotenv";
dotenv.config();
import { getFileContent, validateFileContent } from "./helpers";

class StockChecker {
  private matched: any = [];
  private notMatched: any = [];

  constructor() {}

  run = async () => {
    try {
      const stockHashMap: any = {};

      const stockFileContent = await getFileContent(process.env.STOCK_FILE);

      const stockFileValidation = validateFileContent(stockFileContent);

      if (!stockFileValidation) {
        throw new Error(
          `${process.env.STOCK_FILE} - something went wrong reading the file content!`
        );
      }

      const transFileContent = await getFileContent(
        process.env.TRANSACTIONS_FILE
      );

      const transFileValidation = validateFileContent(transFileContent);

      if (!transFileValidation) {
        throw new Error(
          `${process.env.TRANSACTIONS_FILE} - something went wrong reading the file content!`
        );
      }

      for (let i = 0; i < stockFileContent.length; i++) {
        const sku = stockFileContent[i]?.sku?.trim();
        if (!stockHashMap[sku]) {
          stockHashMap[sku] = stockFileContent[i];
        }
      }

      for (let k = 0; k < transFileContent.length; k++) {
        const sku = transFileContent[k]?.sku?.trim();
        const stockObject = {
          ...transFileContent[k],
          stock: stockHashMap[sku] || {},
        };
        if (stockHashMap[sku]) {
          this.matched.push(stockObject);
        } else {
          this.notMatched.push({
            error: "STOCK_NOT_FOUND_FOR_TRANSACTION",
            stockObject,
          });
        }
      }
    } catch (err) {
      throw new Error(`Error occurred - ${err}`);
    }
  };

  getMatchedSkus() {
    return this.matched;
  }

  getNotMatchedSkus() {
    return this.notMatched;
  }
}

export default StockChecker;
