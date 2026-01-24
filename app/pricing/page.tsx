"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PricingPage() {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/my")
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Unauthorized");
            })
            .then((data) => {
                if (data.meta.result === "SUCCESS" && data.data.name) {
                    return fetch(`/api/subscriptions?name=${data.data.name}`);
                }
                throw new Error("No user name");
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.meta.result === "SUCCESS") {
                    const sub = data.data;
                    const now = new Date();
                    const expireDate = sub.expireDate ? new Date(sub.expireDate) : null;

                    // Active condition: Status is NOT EXPIRED AND Not Expired Date
                    if (sub.status !== 'EXPIRED' && expireDate && expireDate > now) {
                        setIsActive(true);
                    }
                }
            })
            .catch((err) => {
                // Ignore errors (user not logged in, no subscription, etc.)
                // Default state is not active
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>

            {/* Header Link */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link href="/" className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    ← 돌아가기
                </Link>
            </div>

            <section style={{ width: '100%', maxWidth: '900px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>요금제 선택</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                    {/* Free Plan */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Basic</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            0원 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'hsl(var(--muted-foreground))' }}>/ 월</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 기본 기능 제공</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 커뮤니티 지원</li>
                        </ul>
                        <button className="btn" disabled style={{ width: '100%', background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', cursor: 'not-allowed', opacity: 0.7 }}>
                            기본 제공
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '2px solid hsl(var(--primary))', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'hsl(var(--primary))', color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            RECOMMENDED
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>Premium</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            9,900원 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'hsl(var(--muted-foreground))' }}>/ 월</span>
                        </div>
                        <ul style={{ listStyle: 'none', marginBottom: '2rem', flex: 1 }}>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 모든 고급 기능 잠금 해제</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 우선 기술 지원</li>
                            <li style={{ marginBottom: '0.5rem' }}>✓ 광고 제거</li>
                        </ul>

                        {isActive ? (
                            <Link href="/mypage" className="btn" style={{ width: '100%', background: 'hsl(var(--success))', color: 'white', textAlign: 'center' }}>
                                ✔️ 이용 중인 플랜
                            </Link>
                        ) : (
                            <Link href="/payment" className="btn btn-primary" style={{ width: '100%' }}>
                                프리미엄 구독하기
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <style jsx>{`
        .glass-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          border-radius: var(--radius-lg);
        }
      `}</style>
        </div>
    );
}
