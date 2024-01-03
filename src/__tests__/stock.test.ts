import StockChecker from '../index';
import { describe, expect, test } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const stockChecker = new StockChecker();

describe('it should validate the STOCK file content must be present', () => {
    test('if the file contains the json and must not empty', async () => {
        expect(await stockChecker.getFileContent(process.env.STOCK_FILE_NAME)).toBeDefined();
    });
});


describe('it should validate the TRANSACTIONS file content must be present', () => {
    test('if the file contains the json and must not empty', async () => {
        expect(await stockChecker.getFileContent(process.env.TRANSACTIONS_FILE_NAME)).toBeDefined();
    });
});


describe('it should check for each MATCHED sku that the stock value must be defined', () => {
    test('it should check for each MATCHED sku that the stock value must be defined', async () => {

        await stockChecker.run();

        const matchedSkus = stockChecker.getMatchedSkus();

        matchedSkus.forEach((row: any) => {
            expect(row?.stock).toBeDefined();
        });
    });
});



describe('it should throw error for each NON-MATCHED sku', () => {
    test('it should throw an error for each NON-MATCHED sku', async () => {

        const notMatchedSkus = stockChecker.getNotMatchedSkus();

        notMatchedSkus.forEach((row: any) => {
            expect(row.error).toBe('STOCK_NOT_FOUND_FOR_TRANSACTION');
        });
    });
});