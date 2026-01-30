"use client";

import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import CardPaymentForm from "@/components/CardPaymentForm";
import BankTransferForm from "@/components/BankTransferForm";
import TossPayForm from "@/components/TossPayForm";

// Helper to generate a random order ID (mocking an actual order system)
function generateRandomString() {
    return window.btoa(Math.random().toString()).slice(0, 20);
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

export default function PaymentPage() {
    const [price, setPrice] = useState(9900);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null); // 'CARD' | 'BANK' | 'TOSS' | null
    const [tossPayments, setTossPayments] = useState<any>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        if (!clientKey) {
            console.error("No TOSS_CLIENT_KEY found");
            return;
        }
        loadTossPayments(clientKey).then((instance) => {
            setTossPayments(instance);
        });

        // Fetch current user info
        fetch('/api/auth/my')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Not logged in');
            })
            .then(data => {
                if (data.data && data.data.email) {
                    setUserEmail(data.data.email);
                }
                if (data.data && data.data.name) {
                    setUserName(data.data.name);
                }
            })
            .catch(() => {
                // Ignore error if not logged in
            });
    }, []);

    const renderPaymentForm = () => {
        if (selectedMethod === 'CARD') {
            return <CardPaymentForm amount={price} planType="premium" />;
        }
        if (selectedMethod === 'BANK') {
            return <BankTransferForm amount={price} planType="premium" />;
        }
        if (selectedMethod === 'TOSS') {
            return <TossPayForm amount={price} planType="premium" tossPayments={tossPayments} customerName={userName || undefined} />;
        }
        return null;
    };

    return (
        <div className="flex-center" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <main className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                <div className="text-center mb-4">
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>결제하기</h1>
                    <p className="text-muted">원하시는 결제 수단을 선택해주세요</p>
                </div>

                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'hsl(var(--background))', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>상품명</span>
                        <span style={{ fontWeight: 600 }}>Dragons Premium</span>
                    </div>
                    {userEmail && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>구매자</span>
                            <span style={{ fontWeight: 500 }}>{userEmail}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid hsl(var(--border))' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>결제 금액</span>
                        <span style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>{price.toLocaleString()} 원</span>
                    </div>
                </div>

                {selectedMethod ? (
                    <div>
                        <button
                            onClick={() => setSelectedMethod(null)}
                            className="btn mb-12"
                            style={{
                                height: 'auto',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                background: 'hsl(var(--surface))',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'hsl(var(--muted-foreground))',
                                border: '1px solid hsl(var(--border))',
                                marginBottom: '3rem'
                            }}
                        >
                            <span>←</span> 다른 결제 수단 선택
                        </button>
                        {renderPaymentForm()}
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            className="btn"
                            style={{ justifyContent: 'center', height: '3.5rem', fontSize: '1.1rem', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', color: 'white', border: 'none' }}
                            onClick={() => setSelectedMethod('CARD')}
                        >
                            💳 신용/체크카드
                        </button>
                        <button
                            className="btn"
                            style={{ justifyContent: 'center', height: '3.5rem', fontSize: '1.1rem', background: 'hsl(var(--surface))' }}
                            onClick={() => setSelectedMethod('BANK')}
                        >
                            🏦 계좌이체
                        </button>
                        <button
                            className="btn"
                            style={{ justifyContent: 'center', height: '3.5rem', fontSize: '1.1rem', background: '#0050FF', color: 'white', border: 'none' }}
                            onClick={() => setSelectedMethod('TOSS')}
                        >
                            <span style={{ fontWeight: 'bold' }}>toss</span> pay
                        </button>
                    </div>
                )}

                {!selectedMethod && (
                    <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                        위 버튼을 클릭하면 결제 창으로 이동하거나 입력 폼이 나타납니다.
                    </p>
                )}
            </main>
        </div>
    );
}
