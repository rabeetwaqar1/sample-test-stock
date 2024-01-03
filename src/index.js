"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var StockChecker = /** @class */ (function () {
    function StockChecker() {
        var _this = this;
        this.matched = [];
        this.notMatched = [];
        this.getFileContent = function (filename) { return __awaiter(_this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promises_1.default.readFile(path_1.default.resolve(filename)).catch(function (err) {
                            throw new Error("".concat(filename, " - Error (").concat(err, ")"));
                        })];
                    case 1:
                        content = (_a.sent()) || null;
                        return [2 /*return*/, content ? JSON.parse(content === null || content === void 0 ? void 0 : content.toString()) : null];
                }
            });
        }); };
        this.validateFileContent = function (content) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!content)
                    return [2 /*return*/, false];
                if (!Array.isArray(content))
                    return [2 /*return*/, false];
                return [2 /*return*/, true];
            });
        }); };
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var stockHashMap, stockFileContent, stockFileValidation, transFileContent, transFileValidation, i, sku, k, sku, stockObject, err_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        stockHashMap = [];
                        return [4 /*yield*/, this.getFileContent(process.env.STOCK_FILE_NAME)];
                    case 1:
                        stockFileContent = _e.sent();
                        return [4 /*yield*/, this.validateFileContent(stockFileContent)];
                    case 2:
                        stockFileValidation = _e.sent();
                        if (!stockFileValidation) {
                            throw new Error("".concat(process.env.STOCK_FILE_NAME, " - something went wrong reading the file content!"));
                        }
                        return [4 /*yield*/, this.getFileContent(process.env.TRANSACTIONS_FILE_NAME)];
                    case 3:
                        transFileContent = _e.sent();
                        return [4 /*yield*/, this.validateFileContent(transFileContent)];
                    case 4:
                        transFileValidation = _e.sent();
                        if (!transFileValidation) {
                            throw new Error("".concat(process.env.TRANSACTIONS_FILE_NAME, " - something went wrong reading the file content!"));
                        }
                        for (i = 0; i < stockFileContent.length; i++) {
                            sku = (_b = (_a = stockFileContent[i]) === null || _a === void 0 ? void 0 : _a.sku) === null || _b === void 0 ? void 0 : _b.trim();
                            if (!stockHashMap[sku]) {
                                stockHashMap[sku] = stockFileContent[i];
                            }
                        }
                        for (k = 0; k < transFileContent.length; k++) {
                            sku = (_d = (_c = transFileContent[k]) === null || _c === void 0 ? void 0 : _c.sku) === null || _d === void 0 ? void 0 : _d.trim();
                            stockObject = __assign(__assign({}, transFileContent[k]), { stock: stockHashMap[sku] || {} });
                            if (stockHashMap[sku]) {
                                this.matched.push(stockObject);
                            }
                            else {
                                this.notMatched.push({ error: 'STOCK_NOT_FOUND_FOR_TRANSACTION', stockObject: stockObject });
                            }
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _e.sent();
                        throw new Error("Error occurred - ".concat(err_1));
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    }
    StockChecker.prototype.getMatchedSkus = function () {
        return this.matched;
    };
    StockChecker.prototype.getNotMatchedSkus = function () {
        return this.notMatched;
    };
    return StockChecker;
}());
exports.default = StockChecker;
