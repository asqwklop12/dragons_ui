"use client";

import {Suspense, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {authApi} from "@/lib/auth";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const [status, setStatus] = useState("로그인 처리 중...");

    useEffect(() => {
        if (!code) {
            setStatus("인증 코드가 없습니다.");
            return;
        }

        const processLogin = async () => {
            try {
                await authApi.loginWithGoogle(code);
                // Login success
                router.push("/");
                router.refresh();
            } catch (err: any) {
                console.error("Google Login Error:", err);
                setStatus(`로그인 실패: ${err.message}`);
                // Optionally redirect back to login after a delay
                setTimeout(() => router.push("/login"), 3000);
            }
        };

        processLogin();
    }, [code, router]);

    return (
        <div className="flex-center">
            <main className="glass-panel" style={{ padding: "2rem", textAlign: "center", minWidth: "300px" }}>
                <h2 style={{ marginBottom: "1rem" }}>Google 로그인</h2>
                <div style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    animation: "spin 1s infinite linear"
                }}>
                    {status.includes("실패") ? "❌" : "⏳"}
                </div>
                <p className="text-muted">{status}</p>

                {status.includes("실패") && (
                    <button
                        onClick={() => router.push("/login")}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                )}
            </main>
            <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex-center">Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
