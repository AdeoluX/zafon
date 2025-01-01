import axios, { AxiosInstance } from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY as string; // Use your Paystack secret key from the environment

const paystackBaseUrl = "https://api.paystack.co";

// Axios instance with Paystack authorization
const paystackApi: AxiosInstance = axios.create({
  baseURL: paystackBaseUrl,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Response structure from Paystack
interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Metadata interface
interface Metadata {
  [key: string]: any;
}

// Transfer recipient data
interface TransferRecipientData {
  recipient_code: string;
}

// Resolve bank details response
interface BankDetails {
  account_name: string;
  account_number: string;
  bank_id: number;
}

/**
 * Initialize a payment
 * @param email - Customer's email address
 * @param amount - Amount in kobo (Naira * 100)
 * @param callback_url - URL to redirect after payment
 * @param metadata - Additional metadata to include
 * @returns - Paystack response
 */
export const initializePayment = async (
  email: string,
  amount: number,
  callback_url: string,
  metadata: Metadata = {},
  reference: string
): Promise<PaystackResponse<any>> => {
  try {
    const response = await paystackApi.post("/transaction/initialize", {
      email,
      amount,
      callback_url,
      reference,
      metadata,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error initializing payment:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Verify a transaction
 * @param reference - Transaction reference
 * @returns - Paystack response
 */
export const verifyTransaction = async (
  reference: string
): Promise<PaystackResponse<any>> => {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error: any) {
    console.error("Error verifying transaction:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a transfer recipient
 * @param name - Recipient's name
 * @param account_number - Bank account number
 * @param bank_code - Bank code
 * @param currency - Currency (e.g., "NGN")
 * @returns - Paystack response
 */
export const createTransferRecipient = async (
  name: string,
  account_number: string,
  bank_code: string,
  currency: string = "NGN"
): Promise<PaystackResponse<TransferRecipientData>> => {
  try {
    const response = await paystackApi.post("/transferrecipient", {
      type: "nuban",
      name,
      account_number,
      bank_code,
      currency,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating transfer recipient:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Initiate a transfer
 * @param amount - Amount in kobo (Naira * 100)
 * @param recipient_code - Recipient code from Paystack
 * @param reason - Reason for the transfer
 * @returns - Paystack response
 */
export const initiateTransfer = async (
  amount: number,
  recipient_code: string,
  reason: string = ""
): Promise<PaystackResponse<any>> => {
  try {
    const response = await paystackApi.post("/transfer", {
      source: "balance",
      amount,
      recipient: recipient_code,
      reason,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error initiating transfer:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Resolve bank details
 * @param account_number - Bank account number
 * @param bank_code - Bank code
 * @returns - Paystack response
 */
export const resolveBankDetails = async (
  account_number: string,
  bank_code: string
): Promise<PaystackResponse<BankDetails>> => {
  try {
    const response = await paystackApi.get("/bank/resolve", {
      params: { account_number, bank_code },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error resolving bank details:", error.response?.data || error.message);
    throw error;
  }
};
