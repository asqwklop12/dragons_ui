"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";

interface PostDetail {
    id: number;
    title: string;
    content: string;
    category: string;
    author: string;
}

export default function PostDetailPage() {
    const params = useParams();
    const id = params?.id;

    const [post, setPost] = useState<PostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/posts/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.meta && data.meta.result === "SUCCESS" && data.data) {
                    setPost(data.data);
                    setEditTitle(data.data.title);
                    setEditContent(data.data.content);
                } else {
                    setError("게시글을 찾을 수 없습니다.");
                }
            })
            .catch(err => {
                console.error("Error fetching post:", err);
                setError("네트워크 오류가 발생했습니다.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset to original data
        if (post) {
            setEditTitle(post.title);
            setEditContent(post.content);
        }
    };

    const handleUpdate = async () => {
        if (!post) return;
        setSubmitting(true);

        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.meta && data.meta.result === "SUCCESS") {
                    setPost({ ...post, title: editTitle, content: editContent });
                    setIsEditing(false);
                    alert("수정되었습니다.");
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

    const handleDelete = async () => {
        if (!post) return;
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setSubmitting(true);

        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.meta && data.meta.result === "SUCCESS") {
                    alert("삭제되었습니다.");
                    // Force navigation to home
                    window.location.href = '/';
                } else {
                    alert("삭제 실패: " + (data.meta?.message || "알 수 없는 오류"));
                }
            } else {
                alert("삭제 요청 실패 status: " + res.status);
            }
        } catch (err) {
            console.error("Post delete error", err);
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

    if (error || !post) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'hsl(var(--destruct))', marginBottom: '1rem', fontSize: '1.2rem' }}>{error || "게시글을 찾을 수 없습니다."}</div>
                <Link href="/" className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
                    ← 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link href="/" className="btn" style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    ← 돌아가기
                </Link>

                {/* Edit Controls */}
                {!isEditing ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleEditClick}
                            className="btn"
                            style={{ background: 'hsl(var(--primary))', color: 'white', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                        >
                            ✏️ 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn"
                            style={{ background: 'hsla(var(--destruct), 0.1)', color: 'hsl(var(--destruct))', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', border: '1px solid hsla(var(--destruct), 0.2)', cursor: 'pointer' }}
                        >
                            🗑️ 삭제
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleCancelClick}
                            className="btn"
                            disabled={submitting}
                            style={{ background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                        >
                            취소
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="btn"
                            disabled={submitting || (post?.title === editTitle && post?.content === editContent)}
                            style={{
                                background: 'hsl(var(--primary))',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: (submitting || (post?.title === editTitle && post?.content === editContent)) ? 'not-allowed' : 'pointer',
                                opacity: (submitting || (post?.title === editTitle && post?.content === editContent)) ? 0.5 : 1
                            }}
                        >
                            {submitting ? "저장 중..." : "저장"}
                        </button>
                    </div>
                )}
            </div>

            <article className="glass-panel" style={{ padding: '3rem' }}>
                <header style={{ marginBottom: '2rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '1rem' }}>
                    <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'right' }}>
                        작성자: {post.author}
                    </div>

                    {/* Inline Edit Title */}
                    {isEditing ? (
                        <input
                            type="text"
                            className="input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                width: '100%',
                                fontWeight: 'bold',
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                padding: 0,
                                color: 'inherit'
                            }}
                        />
                    ) : (
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{
                            fontSize: '0.8rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            background: 'hsl(var(--secondary) / 0.1)',
                            color: 'hsl(var(--secondary))',
                            fontWeight: 600
                        }}>
                            {post.category}
                        </span>
                    </div>
                </header>

                {/* Inline Edit Content */}
                {isEditing ? (
                    <textarea
                        className="input"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={20}
                        style={{
                            width: '100%',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            padding: 0,
                            resize: 'none',
                            color: 'inherit',
                            fontFamily: 'inherit'
                        }}
                    />
                ) : (
                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                        {post.content}
                    </div>
                )}
            </article>

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
