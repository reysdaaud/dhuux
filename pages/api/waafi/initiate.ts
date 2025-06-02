import type { NextApiRequest, NextApiResponse } from "next";

// --- WAAFI CONFIGURATION (replace with env vars for production) ---
const waafiConfig = {
  apiKey: "API-1922135978AHX",
  merchantId: "M0910161",
  apiUserId: "1000146",
  endpoint: "https://api.waafipay.net/asm",
  paymentMethodMWallet: "MWALLET_ACCOUNT",
  currency: "USD",
  channelName: "WEB",
  serviceNameTopUp: "API_PURCHASE",
};

function getFormattedTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

async function makeWaafiRequest(serviceName: string, serviceParamsInput: any) {
  const config = waafiConfig;
  const requestId = Date.now().toString() + Math.random().toString().slice(2, 12).replace('.', '');
  const timestamp = getFormattedTimestamp();

  const requestBody = {
    schemaVersion: "1.0",
    requestId,
    timestamp,
    channelName: config.channelName,
    serviceName,
    serviceParams: {
      merchantUid: config.merchantId,
      apiUserId: config.apiUserId,
      apiKey: config.apiKey,
      ...serviceParamsInput,
    },
  };

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return {
        success: false,
        error: `Invalid JSON response. Status: ${response.status}. Response: ${responseText.slice(0, 500)}...`,
      };
    }

    const responseCodeStr = data.responseCode?.toString();
    const isSuccess = responseCodeStr === "2001";
    const isPending = responseCodeStr === "2003";
    const isRcsSuccess = data.responseMsg?.toUpperCase() === "RCS_SUCCESS";

    if (isSuccess || isPending || isRcsSuccess) {
      return {
        success: true,
        message: data.responseMsg || (isPending ? "Transaction pending confirmation." : "Transaction succeeded."),
        transactionId: data.params?.transactionId || data.params?.orderId || requestId,
        data: data.params,
        isPending,
      };
    } else {
      let errorMsg = "Unknown WAAFI error";
      if (responseCodeStr === "5310") { 
        errorMsg = data.responseMsg || "RCS_USER_REJECTED"; 
        if (data.params?.description) {
          errorMsg += ` (${data.params.description})`;
        }
      } else if (data.responseMsg) {
        errorMsg = data.responseMsg;
        if (data.params?.description && errorMsg.toUpperCase() !== data.params.description.toUpperCase()) {
          errorMsg += ` (${data.params.description})`;
        }
      } else if (data.params?.description) {
        errorMsg = data.params.description;
      } else if (responseCodeStr) {
        errorMsg = `WAAFI Error Code: ${responseCodeStr}`;
      } else if (data.errorCode) {
        errorMsg = `WAAFI Error Code: ${data.errorCode}`;
      }
      return {
        success: false,
        error: errorMsg,
        transactionId: data.params?.transactionId || data.params?.orderId || requestId,
        data: data.params,
      };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred during request.";
    return {
      success: false,
      error: `Network or application error: ${errorMessage}`,
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const { amount, phoneNumber, metadata } = req.body;

  if (!amount || !phoneNumber || !metadata) {
    return res.status(400).json({ success: false, message: "Missing required payment details." });
  }

  // Build serviceParams as per your Postman example
  const serviceParams = {
    paymentMethod: waafiConfig.paymentMethodMWallet,
    payerInfo: {
      accountNo: phoneNumber,
    },
    transactionInfo: {
      referenceId: `REF${Date.now().toString().slice(-7)}`,
      invoiceId: `INV${Date.now().toString().slice(-5)}`,
      amount: amount.toString(),
      currency: waafiConfig.currency,
      description: "test",
    },
  };

  const waafiResponse = await makeWaafiRequest(waafiConfig.serviceNameTopUp, serviceParams);

  if (waafiResponse.success) {
    return res.status(200).json({
      success: true,
      message: waafiResponse.message,
      transactionId: waafiResponse.transactionId,
      data: waafiResponse.data,
      isPending: waafiResponse.isPending,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: waafiResponse.error,
      data: waafiResponse.data,
    });
  }
}