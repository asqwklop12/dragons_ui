"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {paymentApi} from "@/lib/payment";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState("");

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    useEffect(() => {
        if (!paymentKey || !orderId || !amount) {
            setStatus('error');
            setErrorMessage("결제 정보가 누락되었습니다.");
            return;
        }

        const confirm = async () => {
            try {
                await paymentApi.confirmPayment(paymentKey, orderId, amount);
                setStatus('success');
            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setErrorMessage(err.message || "결제 승인 처리 중 문제가 발생했습니다.");
            }
        };

        confirm();
    }, [paymentKey, orderId, amount]);

    if (status === 'loading') {
        return (
            <div className="flex-center">
                <div className="glass-panel text-center" style={{ padding: '3rem' }}>
                    <div className="spinner mx-auto mb-6"></div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>결제 승인 중</h1>
                    <p className="text-muted">잠시만 기다려주세요, 안전하게 처리 중입니다.</p>
                </div>
                <style jsx>{`
                    .spinner {
                        width: 64px;
                        height: 64px;
                        border: 4px solid hsl(var(--primary));
                        border-top-color: transparent;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .mx-auto { margin-left: auto; margin-right: auto; }
                    .mb-6 { margin-bottom: 1.5rem; }
                `}</style>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex-center">
                <div className="glass-panel text-center" style={{ padding: '2.5rem', maxWidth: '448px', width: '100%', border: '1px solid hsla(var(--destruct), 0.2)' }}>
                    <div className="error-icon-box mb-6">
                        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>결제 실패</h1>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>{errorMessage}</p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <Link href="/payment" className="btn btn-primary">다시 결제하기</Link>
                        <Link href="/" className="btn btn-secondary" style={{ backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--surface-foreground))' }}>홈으로 이동</Link>
                    </div>
                </div>
                <style jsx>{`
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
                    .mb-6 { margin-bottom: 1.5rem; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="flex-center" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Decorative Blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="glass-panel scale-in-center" style={{ padding: '2.5rem', maxWidth: '512px', width: '100%', position: 'relative', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div className="success-checkmark" style={{ marginBottom: '1.5rem' }}>
                        <div className="check-icon">
                            <span className="icon-line line-tip"></span>
                            <span className="icon-line line-long"></span>
                            <div className="icon-circle"></div>
                            <div className="icon-fix"></div>
                        </div>
                    </div>
                    <h1 className="success-title">
                        결제 성공!
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.125rem' }}>성공적으로 구독이 시작되었습니다.</p>
                </div>

                <div className="summary-box">
                    <div className="summary-row">
                        <span className="text-muted">주문 번호</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{orderId}</span>
                    </div>
                    <div className="summary-row">
                        <span className="text-muted">결제 일시</span>
                        <span style={{ fontWeight: 500 }}>{new Date().toLocaleString()}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="summary-row" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>최종 결제 금액</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'hsl(var(--primary))' }}>{Number(amount).toLocaleString()}원</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <Link href="/" className="btn btn-primary" style={{ height: '3.5rem', fontSize: '1.125rem', boxShadow: '0 10px 15px -3px hsla(var(--primary), 0.3)' }}>
                        서비스 시작하기
                    </Link>
                    <p className="text-center text-muted" style={{ fontSize: '0.75rem' }}>결제 영수증은 이메일로 발송되었습니다.</p>
                </div>
            </div>

            <style jsx>{`
                .blob {
                    position: absolute;
                    width: 40%;
                    height: 40%;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.15;
                    z-index: 0;
                    animation: pulse 4s ease-in-out infinite;
                }
                .blob-1 { top: -10%; left: -10%; background: hsl(var(--primary)); }
                .blob-2 { bottom: -10%; right: -10%; background: hsl(var(--secondary)); animation-delay: 2s; }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.1); opacity: 0.2; }
                }

                .success-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .summary-box {
                    background: hsla(var(--muted), 0.3);
                    border-radius: var(--radius-md);
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                }
                .divider {
                    height: 1px;
                    background: hsl(var(--border));
                    margin: 0.75rem 0;
                }

                .scale-in-center {
                    animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
                }
                @keyframes scale-in-center {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .success-checkmark {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                }
                .check-icon {
                    width: 80px;
                    height: 80px;
                    position: relative;
                    border-radius: 50%;
                    box-sizing: content-box;
                    border: 4px solid hsl(var(--success));
                }
                .icon-line {
                    height: 5px;
                    background-color: hsl(var(--success));
                    display: block;
                    border-radius: 2px;
                    position: absolute;
                    z-index: 10;
                }
                .line-tip {
                    top: 46px;
                    left: 14px;
                    width: 25px;
                    transform: rotate(45deg);
                    animation: icon-line-tip 0.75s;
                }
                .line-long {
                    top: 38px;
                    right: 8px;
                    width: 47px;
                    transform: rotate(-45deg);
                    animation: icon-line-long 0.75s;
                }
                .icon-circle {
                    top: -4px;
                    left: -4px;
                    z-index: 10;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    position: absolute;
                    box-sizing: content-box;
                    border: 4px solid hsla(var(--success), 0.2);
                }
                .icon-fix {
                    top: 8px;
                    width: 5px;
                    left: 28px;
                    z-index: 1;
                    height: 85px;
                    position: absolute;
                    transform: rotate(-45deg);
                }
                @keyframes icon-line-tip {
                    0% { width: 0; left: 1px; top: 19px; }
                    54% { width: 0; left: 1px; top: 19px; }
                    100% { width: 25px; left: 14px; top: 46px; }
                }
                @keyframes icon-line-long {
                    0% { width: 0; right: 46px; top: 54px; }
                    65% { width: 0; right: 46px; top: 54px; }
                    100% { width: 47px; right: 8px; top: 38px; }
                }
            `}</style>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="flex-center">Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
