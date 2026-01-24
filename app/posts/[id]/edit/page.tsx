"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [formData, setFormData] = useState({
        title: "",
        content: ""
        // Category cannot be updated per API spec
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        // Fetch existing data
        fetch(`/api/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.meta && data.meta.result === "SUCCESS" && data.data) {
                    setFormData({
                        title: data.data.title,
                        content: data.data.content
                    });
                } else {
                    alert("게시글 정보를 불러오지 못했습니다.");
                    router.push('/');
                }
            })
            .catch(err => {
                console.error("Error fetching post:", err);
                alert("네트워크 오류가 발생했습니다.");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.meta && data.meta.result === "SUCCESS") {
                    alert("게시글이 수정되었습니다!");
                    router.push(`/posts/${id}`);
                } else {
                    alert("수정 실패: " + (data.meta?.message || "알 수 없는 오류"));
                }
            } else {
                alert("수정 요청 실패 status: " + res.status);
            }
        } catch (err) {
            console.error("Post update error", err);
            alert("네트워크 오류가 발생했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'hsl(var(--muted-foreground))' }}>로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header Link */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href={`/posts/${id}`} className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    ← 돌아가기
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>게시글 수정</h2>

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
                        disabled={submitting}
                        style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
                    >
                        {submitting ? "수정 중..." : "수정 완료"}
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
