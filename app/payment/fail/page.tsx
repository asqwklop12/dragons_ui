"use client";

import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {Suspense, useEffect, useState} from "react";
import {paymentApi} from "@/lib/payment";

function PaymentFailContent() {
    const searchParams = useSearchParams();
    const [isReported, setIsReported] = useState(false);

    const code = searchParams.get("code") || "UNKNOWN_ERROR";
    const message = searchParams.get("message") || "결제 진행 중 알 수 없는 오류가 발생했습니다.";
    const orderId = searchParams.get("orderId") || "";

    useEffect(() => {
        if (!isReported && orderId) {
            paymentApi.failPayment(code, message, orderId).catch(err => {
                console.error("Failed to report payment failure to backend:", err);
            });
            setIsReported(true);
        }
    }, [code, message, orderId, isReported]);

    return (
        <div className="flex-center" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Decorative Blob */}
            <div className="blob"></div>

            <div className="glass-panel scale-in-center" style={{ padding: '2.5rem', maxWidth: '512px', width: '100%', position: 'relative', zIndex: 10, border: '1px solid hsla(var(--destruct), 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div className="error-icon-box">
                        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="error-title">
                        결제 실패
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.125rem' }}>요청을 처리하는 중에 문제가 발생했습니다.</p>
                </div>

                <div className="error-summary">
                    <p style={{ color: 'hsl(var(--destruct))', fontWeight: 700, marginBottom: '0.5rem' }}>{message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6 }}>
                        <span>에러 코드</span>
                        <span style={{ fontFamily: 'monospace' }}>{code}</span>
                    </div>
                    {orderId && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
                            <span>주문 번호</span>
                            <span style={{ fontFamily: 'monospace' }}>{orderId}</span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <Link href="/payment" className="btn btn-primary" style={{ height: '3.5rem', fontSize: '1.125rem' }}>
                        다시 결제 시도하기
                    </Link>
                    <Link href="/" className="btn btn-secondary" style={{ height: '3.5rem', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--surface-foreground))' }}>
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .blob {
                    position: absolute;
                    top: -10%;
                    right: -10%;
                    width: 40%;
                    height: 40%;
                    background: hsl(var(--destruct));
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.1;
                    animation: pulse 4s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.1); opacity: 0.15; }
                }

                .error-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(to right, hsl(var(--destruct)), hsl(var(--secondary)));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .error-icon-box {
                    width: 80px;
                    height: 80px;
                    background: hsla(var(--destruct), 0.1);
                    color: hsl(var(--destruct));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }

                .error-summary {
                    background: hsla(var(--destruct), 0.05);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    border: 1px solid hsla(var(--destruct), 0.1);
                }

                .scale-in-center {
                    animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
                @keyframes scale-in-center {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="flex-center">Loading...</div>}>
            <PaymentFailContent />
        </Suspense>
    );
}
