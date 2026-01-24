"use client";

import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {authApi} from "@/lib/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authApi.register(name, email, password);
            // Register successful
            // Redirect to login page
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center">
            <main className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div className="text-center mb-4">
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>회원가입</h1>
                    <p className="text-muted">지금 Dragons와 함께하세요</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'hsl(var(--destruct) / 0.1)',
                        color: 'hsl(var(--destruct))',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            className="input"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="비밀번호를 생성하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        style={{ marginBottom: '1rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? '가입 중...' : '가입하기'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-muted">
                        이미 계정이 있으신가요? <Link href="/login" className="link">로그인</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
