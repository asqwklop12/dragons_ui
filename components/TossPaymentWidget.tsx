"use client";

import {useEffect, useRef, useState} from "react";
import {loadPaymentWidget, PaymentWidgetInstance} from "@tosspayments/payment-widget-sdk";

// Random ID generation for valid customer key if not logged in
function generateRandomString() {
    if (typeof window === 'undefined') return "server-side-id";
    return window.btoa(Math.random().toString()).slice(0, 20);
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

export default function TossPaymentWidget() {
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
    const [price, setPrice] = useState(9900);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!clientKey) {
            console.error("Toss Client Key is missing");
            return;
        }

        (async () => {
            // Initialize Widget
            const customerKey = generateRandomString();
            const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

            // Render Payment Methods
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                "#payment-widget",
                { value: price },
                { variantKey: "DEFAULT" }
            );

            // Render Agreement
            paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

            paymentWidgetRef.current = paymentWidget;
            paymentMethodsWidgetRef.current = paymentMethodsWidget;
            setReady(true);
        })();
    }, [price]); // Added price dependency to initial render logic if needed, though strictly it should be separate.
    // Actually, renderPaymentMethods should only be called once. updating amount is separate.
    // Fixed logic below:

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;
        if (paymentMethodsWidget == null) return;
        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    const handlePaymentRequest = async () => {
        const paymentWidget = paymentWidgetRef.current;
        if (!paymentWidget) return;

        try {
            await paymentWidget.requestPayment({
                orderId: generateRandomString(),
                orderName: "Dragons Premium Plan",
                customerName: "Customer",
                customerEmail: "customer@example.com",
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            console.error("Payment Error:", error);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '600px', margin: '2rem auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>결제하기</h3>

            {/* Divs for Toss Widgets */}
            <div id="payment-widget" style={{ width: "100%" }} />
            <div id="agreement" style={{ width: "100%" }} />

            <button
                className="btn btn-primary w-full"
                style={{ marginTop: '2rem', fontSize: '1.1rem', padding: '1rem' }}
                onClick={handlePaymentRequest}
                disabled={!ready}
            >
                {ready ? `${price.toLocaleString()}원 결제하기` : "결제 모듈 로딩 중..."}
            </button>
        </div>
    );
}
