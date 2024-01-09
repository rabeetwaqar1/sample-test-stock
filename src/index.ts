import dotenv from "dotenv";
dotenv.config();
import { getFileContent, validateFileContent, validateSku } from "./helpers";
import { Console } from "console";

class StockChecker {
  private givenSku: string | null = null;
  private stockFileContent: any = null;
  private transFileContent: any = null;
  private currentStockLevel: number = 0;
  private mergedObject: any = {};
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

      const stockObject = this.getStock();

      if (!stockObject) {
        throw new Error("STOCK_NOT_FOUND_FOR_GIVEN_SKU_IN_STOCKS_FILE");
      }

      const transactions = this.getTransactions();

      if (!transactions?.length) {
        throw new Error("TRANSACTIONS_NOT_FOUND_FOR_GIVEN_SKU_IN_TRANS_FILE");
      }

      const stockLevel = Number(stockObject?.stock) || 0;

      if (!stockLevel) {
        throw new Error("STOCK_LEVEL_NOT_FOUND_FOR_GIVEN_SKU");
      }

      const purchaseQty = this.getQuantityByOrderType("order");
      const refundQty = this.getQuantityByOrderType("refund");

      if (purchaseQty > stockLevel) {
        throw new Error("PURCHASE_QUANTITY_IS_GREATOR_THAN_STOCK_LEVELS");
      }

      this.currentStockLevel = this.calculateStockLevels(
        stockLevel,
        purchaseQty,
        refundQty
      );

      return "SUCCESS";
    } catch (err: any) {
      throw new Error(err?.message);
    }
  };

  calculateStockLevels(
    currentStock: number,
    purchaseQty: number,
    refundQty: number
  ) {
    const refunded = Number(
      refundQty > 0 ? currentStock + refundQty : currentStock
    );
    const stock = Number(refunded > 0 ? refunded - purchaseQty : currentStock);
    return stock ?? currentStock;
  }

  getQuantityByOrderType(orderType: string) {
    return this.getTransactions().reduce((acc: any, record: any) => {
      if (record?.type?.includes(orderType)) {
        return acc + (record?.qty || 0);
      }
      return acc;
    }, 0);
  }

  getCurrentStockLevel() {
    return this.currentStockLevel;
  }

  getTransactions() {
    return this.getTransFileContent().filter(
      (row: { sku: (string | null)[] }) => row?.sku?.includes(this.givenSku)
    );
  }

  getStock() {
    return this.getStockFileContent().find((row: { sku: (string | null)[] }) =>
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
