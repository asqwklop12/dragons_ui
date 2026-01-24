"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
// import TossPaymentWidget from "@/components/TossPaymentWidget"; // Removing embedding

export default function Home() {
  interface Post {
    id: number;
    title: string;
    category: string;
    author: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts?page=1&limit=5&sort=createdAt,desc')
      .then(res => res.json())
      .then(data => {
        if (data.meta && data.meta.result === "SUCCESS" && data.data && data.data.posts) {
          setPosts(data.data.posts);
        }
      })
      .catch(err => console.error("Failed to fetch posts", err));
  }, []);

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(res => {
        if (res.ok) {
          // Clear session cookie explicitly
          document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // Redirect to login page
          window.location.href = '/login';
        } else {
          console.error("Logout failed with status:", res.status);
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error("Logout network error", err);
        window.location.reload();
      });
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', position: 'relative' }}>

      {/* Header Actions - Fixed Position */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999, display: 'flex', gap: '10px' }}>
        <Link href="/mypage" className="btn" style={{
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          background: 'hsl(var(--secondary))',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer'
        }}>
          👤 내 정보
        </Link>
        <Link href="/pricing" className="btn" style={{
          padding: '0.5rem 1rem',
          fontSize: '0.9rem',
          background: 'hsl(var(--primary))',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          textDecoration: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer'
        }}>
          💎 요금제
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="btn"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            background: 'hsla(var(--destruct), 0.1)',
            color: 'hsl(var(--destruct))',
            border: '1px solid hsla(var(--destruct), 0.2)',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* Latest Posts Section */}
      <section style={{ width: '100%', maxWidth: '800px', marginBottom: '4rem' }}>

        {/* Section Header with Write Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
          <Link href="/posts/new" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            ✏️ 글쓰기
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          {posts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
              게시글이 없습니다.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                  <th style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', width: '60%' }}>제목</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', width: '20%' }}>카테고리</th>
                  <th style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', width: '20%' }}>작성자</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <Link href={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500, display: 'block' }}>
                        {post.title}
                      </Link>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
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
                    </td>
                    <td style={{ padding: '0.75rem', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>{post.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>


      <style jsx>{`
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
