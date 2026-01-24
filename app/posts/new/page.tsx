"use client";

import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function NewPostPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "BACKEND", // Default category
        isPublic: true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("게시글이 작성되었습니다!");
                router.push('/');
            } else {
                const errorData = await res.json();
                alert("작성 실패: " + (errorData.message || "알 수 없는 오류"));
            }
        } catch (err) {
            console.error("Post creation error", err);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header Link */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    ← 돌아가기
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>새 글 작성</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="form-group">
                        <label className="label">제목</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="제목을 입력하세요"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">카테고리</label>
                        <select
                            className="input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="BACKEND">Backend</option>
                            <option value="FRONTEND">Frontend</option>
                            <option value="DEVOPS">DevOps</option>
                            <option value="ETC">Etc</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">내용</label>
                        <textarea
                            className="input"
                            rows={10}
                            placeholder="내용을 자유롭게 입력하세요"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        {loading ? "작성 중..." : "작성 완료"}
                    </button>
                </form>
            </div>

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
