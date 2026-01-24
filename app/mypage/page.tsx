"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserInfo {
    email: string;
    name: string;
}

interface SubscriptionInfo {
    holderName: string;
    planType: string;
    status: string;
    expireDate: string | null;
}

export default function MyPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/my")
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Unauthorized");
            })
            .then((data) => {
                if (data.meta.result === "SUCCESS") {
                    setUser(data.data);
                    return data.data.name;
                }
                throw new Error("Failed to load user info");
            })
            .then((name) => {
                // Fetch subscription info using the name
                return fetch(`/api/subscriptions?name=${name}`);
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.meta.result === "SUCCESS") {
                    setSubscription(data.data);
                }
            })
            .catch((err) => {
                console.error(err);
                // If unauthorized, redirect to login
                if (err.message === "Unauthorized") {
                    router.push("/login");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    const handleCancelSubscription = async () => {
        if (!subscription || !subscription.holderName) return;

        if (!confirm("정말로 구독을 취소하시겠습니까?")) return;

        try {
            const res = await fetch("/api/subscriptions/cancel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: subscription.holderName }),
            });

            if (res.ok) {
                alert("구독이 취소되었습니다.");
                window.location.reload();
            } else {
                alert("구독 취소에 실패했습니다.");
            }
        } catch (err) {
            console.error(err);
            alert("오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: "100vh" }}>Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="container" style={{ minHeight: "100vh", padding: "4rem 0" }}>
            {/* Header Link */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                <Link href="/" className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    ← 돌아가기
                </Link>
            </div>

            <main style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>내 정보</h1>

                <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>기본 정보</h2>
                    <div style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                            <span className="text-muted">이름</span>
                            <span style={{ fontWeight: 500 }}>{user.name}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                            <span className="text-muted">이메일</span>
                            <span style={{ fontWeight: 500 }}>{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>구독 정보</h2>
                    {subscription && subscription.status !== "NONE" && subscription.status !== "EXPIRED" ? (
                        <div>
                            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                                    <span className="text-muted">플랜</span>
                                    <span style={{ fontWeight: 600, color: "hsl(var(--primary))" }}>{subscription.planType}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                                    <span className="text-muted">상태</span>
                                    <span style={{ fontWeight: 600 }}>{subscription.status}</span>
                                </div>
                                {subscription.expireDate && (
                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                                        <span className="text-muted">만료일</span>
                                        <span style={{ fontWeight: 500 }}>
                                            {new Date(subscription.expireDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {subscription.status === 'ACTIVE' ? (
                                <button
                                    onClick={handleCancelSubscription}
                                    className="btn"
                                    style={{
                                        width: "100%",
                                        background: "hsla(var(--destruct), 0.1)",
                                        color: "hsl(var(--destruct))",
                                        border: "1px solid hsla(var(--destruct), 0.2)"
                                    }}
                                >
                                    구독 취소
                                </button>
                            ) : (
                                <div style={{
                                    textAlign: "center",
                                    padding: "0.5rem",
                                    color: "hsl(var(--muted-foreground))",
                                    fontSize: "0.9rem",
                                    cursor: "default"
                                }}>
                                    해지 대기 중
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "2rem 0" }}>
                            <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                                현재 이용 중인 구독이 없습니다.
                            </p>
                            <Link href="/payment" className="btn btn-primary">
                                구독하러 가기
                            </Link>
                        </div>
                    )}
                </div>


            </main>

            <style jsx>{`
        .glass-panel {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
        }
      `}</style>
        </div>
    );
}
