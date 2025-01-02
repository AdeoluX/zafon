"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBankDetails = exports.initiateTransfer = exports.createTransferRecipient = exports.verifyTransaction = exports.initializePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // Use your Paystack secret key from the environment
const paystackBaseUrl = "https://api.paystack.co";
// Axios instance with Paystack authorization
const paystackApi = axios_1.default.create({
    baseURL: paystackBaseUrl,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    },
});
/**
 * Initialize a payment
 * @param email - Customer's email address
 * @param amount - Amount in kobo (Naira * 100)
 * @param callback_url - URL to redirect after payment
 * @param metadata - Additional metadata to include
 * @returns - Paystack response
 */
const initializePayment = (email_1, amount_1, callback_url_1, ...args_1) => __awaiter(void 0, [email_1, amount_1, callback_url_1, ...args_1], void 0, function* (email, amount, callback_url, metadata = {}, reference) {
    var _a;
    try {
        const response = yield paystackApi.post("/transaction/initialize", {
            email,
            amount,
            callback_url,
            reference,
            metadata,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error initializing payment:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.initializePayment = initializePayment;
/**
 * Verify a transaction
 * @param reference - Transaction reference
 * @returns - Paystack response
 */
const verifyTransaction = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield paystackApi.get(`/transaction/verify/${reference}`);
        return response.data;
    }
    catch (error) {
        console.error("Error verifying transaction:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.verifyTransaction = verifyTransaction;
/**
 * Create a transfer recipient
 * @param name - Recipient's name
 * @param account_number - Bank account number
 * @param bank_code - Bank code
 * @param currency - Currency (e.g., "NGN")
 * @returns - Paystack response
 */
const createTransferRecipient = (name_1, account_number_1, bank_code_1, ...args_1) => __awaiter(void 0, [name_1, account_number_1, bank_code_1, ...args_1], void 0, function* (name, account_number, bank_code, currency = "NGN") {
    var _a;
    try {
        const response = yield paystackApi.post("/transferrecipient", {
            type: "nuban",
            name,
            account_number,
            bank_code,
            currency,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error creating transfer recipient:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.createTransferRecipient = createTransferRecipient;
/**
 * Initiate a transfer
 * @param amount - Amount in kobo (Naira * 100)
 * @param recipient_code - Recipient code from Paystack
 * @param reason - Reason for the transfer
 * @returns - Paystack response
 */
const initiateTransfer = (amount_1, recipient_code_1, ...args_1) => __awaiter(void 0, [amount_1, recipient_code_1, ...args_1], void 0, function* (amount, recipient_code, reason = "") {
    var _a;
    try {
        const response = yield paystackApi.post("/transfer", {
            source: "balance",
            amount,
            recipient: recipient_code,
            reason,
        });
        return response.data;
    }
    catch (error) {
        console.error("Error initiating transfer:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.initiateTransfer = initiateTransfer;
/**
 * Resolve bank details
 * @param account_number - Bank account number
 * @param bank_code - Bank code
 * @returns - Paystack response
 */
const resolveBankDetails = (account_number, bank_code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield paystackApi.get("/bank/resolve", {
            params: { account_number, bank_code },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error resolving bank details:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.resolveBankDetails = resolveBankDetails;
//# sourceMappingURL=paystack.utils.js.map