import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

class StockChecker {

    private matched: any = [];
    private notMatched: any = [];

    constructor() {}

    getFileContent = async (filename: any) => {
        const content = await fs.readFile(path.resolve(filename)).catch((err) => {
            throw new Error(`${filename} - Error (${err})`);
        }) || null;

        return content ? JSON.parse(content?.toString()) : null;
    }

    validateFileContent = async (content: object | string | null | undefined) => {
        if (!content) return false;
        if (!Array.isArray(content)) return false;
        return true;
    }

    run = async () => {
        try {
    
            const stockHashMap: any = [];
    
            const stockFileContent = await this.getFileContent(process.env.STOCK_FILE_NAME);
    
            const stockFileValidation = await this.validateFileContent(stockFileContent);
    
            if (!stockFileValidation) {
                throw new Error(`${process.env.STOCK_FILE_NAME} - something went wrong reading the file content!`);
            }
    
            const transFileContent = await this.getFileContent(process.env.TRANSACTIONS_FILE_NAME);
    
            const transFileValidation = await this.validateFileContent(transFileContent);
    
            if (!transFileValidation) {
                throw new Error(`${process.env.TRANSACTIONS_FILE_NAME} - something went wrong reading the file content!`);
            }
    
            for (let i = 0; i < stockFileContent.length; i++) {
                const sku = stockFileContent[i]?.sku?.trim();
                if (!stockHashMap[sku]) {
                    stockHashMap[sku] = stockFileContent[i];
                }
            }

            for (let k = 0; k < transFileContent.length; k++) {
                const sku = transFileContent[k]?.sku?.trim();
                const stockObject = { ...transFileContent[k], stock: stockHashMap[sku] || {} };
                if (stockHashMap[sku]) {
                    this.matched.push(stockObject);
                } else {
                    this.notMatched.push({ error: 'STOCK_NOT_FOUND_FOR_TRANSACTION', stockObject });
                }
            }

        } catch (err) {
            throw new Error(`Error occurred - ${err}`);
        }
    }

    getMatchedSkus() {
        return this.matched;
    }

    getNotMatchedSkus() {
        return this.notMatched;
    }
}

export default StockChecker;
