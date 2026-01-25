// Card Payment DTOs
export interface CardPaymentRequest {
    cardNumber: string; // 16 digits
    expiryMonth: number; // 1-12
    expiryYear: number; // 4-digit year
    cvc: string; // 3 digits
    cardholderName: string;
    amount: number;
    planType?: string; // "premium" | "basic"
}

export interface CardPaymentResponse {
    cardNumber: string;
    amount: number;
    planType: string;
}

// Bank Transfer DTOs
export interface BankTransferRequest {
    bankCode: string; // 3 digits
    accountNumber: string; // 10-14 digits
    depositorName: string; // 2-20 chars
    amount: number;
    planType?: string;
}

export interface BankTransferResponse {
    bankCode: string;
    accountNumber: string;
    depositorName: string;
    amount: number;
    planType: string;
}

// Toss Pay DTOs
export interface TossPaymentRequest {
    amount: number;
    orderName: string;
    // customerName removed as it is handled by backend session
    planType?: string;
    orderId?: string;
}

export interface TossPaymentResponse {
    orderId: string;
    amount: number;
    orderName: string;
    customerName: string;
    successUrl: string;
    failUrl: string;
}

export interface PaymentSuccessResponse {
    // Define if the backend returns specific data, mostly void based on controller
}

export const paymentApi = {
    requestCardPayment: async (data: CardPaymentRequest): Promise<CardPaymentResponse> => {
        const response = await fetch('/api/payments/card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = error.meta?.message || error.message || '카드 결제 요청에 실패했습니다.';
            throw new Error(message);
        }

        const result = await response.json();
        return result.data as CardPaymentResponse;
    },

    requestBankTransfer: async (data: BankTransferRequest): Promise<BankTransferResponse> => {
        const response = await fetch('/api/payments/bank-transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = error.meta?.message || error.message || '계좌이체 요청에 실패했습니다.';
            throw new Error(message);
        }

        const result = await response.json();
        return result.data as BankTransferResponse;
    },

    requestTossPayment: async (data: TossPaymentRequest): Promise<TossPaymentResponse> => {
        const response = await fetch('/api/payments/toss', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true, // Crucial for concurrent flow before redirect
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = error.meta?.message || error.message || '토스 결제 준비에 실패했습니다.';
            throw new Error(message);
        }

        const result = await response.json();
        // Handle both wrapped and unwrapped responses defensively
        return (result.data ? result.data : result) as TossPaymentResponse;
    },

    confirmPayment: async (paymentKey: string, orderId: string, amount: string): Promise<void> => {
        const params = new URLSearchParams({
            paymentKey,
            orderId,
            amount,
        });

        const response = await fetch(`/api/payments/toss/success?${params.toString()}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || '결제 승인에 실패했습니다.');
        }
    },

    failPayment: async (code: string, message: string, orderId: string): Promise<void> => {
        const params = new URLSearchParams({
            code,
            message,
            orderId,
        });

        await fetch(`/api/payments/toss/fail?${params.toString()}`, {
            method: 'GET',
        });
    }
};
