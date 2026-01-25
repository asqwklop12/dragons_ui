"use client";

import { useState } from "react";
import { paymentApi } from "@/lib/payment";


interface TossPayFormProps {
    amount: number;
    planType: string;
    tossPayments: any; // The Toss SDK instance
}

export default function TossPayForm({ amount, planType, tossPayments }: TossPayFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!tossPayments) {
            alert("결제 모듈이 아직 로딩 중입니다. 잠시만 기다려주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log("Starting Toss Pay flow (Standard sequence)...");

            // 1. Initialize payment with backend
            const initResponse = await paymentApi.requestTossPayment({
                amount: amount,
                orderName: "구독",
                planType: planType
            });
            console.log("Backend response received:", initResponse);

            // 2. Map data from backend
            const { orderId, amount: resAmount, orderName, customerName } = initResponse;

            // UI Redirect URLs (Point to frontend instead of API)
            const frontendBaseUrl = window.location.origin;
            const uiSuccessUrl = `${frontendBaseUrl}/payment/success`;
            const uiFailUrl = `${frontendBaseUrl}/payment/fail`;

            console.log("Opening Toss Payment window...");

            // v2 standard payment instance
            const customerKey = "customer_" + Math.random().toString(36).substring(2, 10);
            const payment = tossPayments.payment({ customerKey });

            console.log("Requesting payment via CARD (with Toss Pay direct)...");
            await payment.requestPayment({
                method: "CARD",
                amount: {
                    currency: "KRW",
                    value: Number(resAmount),
                },
                orderId: orderId,
                orderName: orderName,
                successUrl: uiSuccessUrl,
                failUrl: uiFailUrl,
                customerName: customerName,
                card: {
                    easyPay: "TOSSPAY",
                    flowMode: "DIRECT",
                },
            });

        } catch (err: any) {
            console.error("!!! Toss Payment Error Detail !!!", err);
            setError(err.message || "결제 요청 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 text-center">
            {error && (
                <div style={{ backgroundColor: 'hsl(var(--destruct) / 0.1)', color: 'hsl(var(--destruct))', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {error}
                </div>
            )}

            <div style={{ padding: '2rem 1rem', background: 'hsl(var(--surface))', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border))' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>toss <span style={{ fontWeight: 800 }}>pay</span></div>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                        토스 앱에서 안전하고 간편하게 결제하실 수 있습니다.
                    </p>
                </div>

                <ul style={{ textAlign: 'left', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'grid', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', gap: '0.5rem' }}>✅ 토스 포인트 및 머니 사용 가능</li>
                    <li style={{ display: 'flex', gap: '0.5rem' }}>✅ 카드 및 계좌 결제 지원</li>
                    <li style={{ display: 'flex', gap: '0.5rem' }}>✅ 간편 인증으로 빠른 결제</li>
                </ul>

                <button
                    onClick={handlePayment}
                    className="btn w-full"
                    style={{
                        height: '3.5rem',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: '#0050FF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem'
                    }}
                    disabled={loading}
                >
                    {loading ? "결제창을 여는 중..." : `${amount.toLocaleString()}원 결제하기`}
                </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                버튼을 누르면 토스 결제 창으로 안전하게 연결됩니다.
            </p>
        </div>
    );
}
