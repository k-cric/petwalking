import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebaseConfig';
import { Post } from '../types';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        // TODO: 포스트 데이터 가져오기
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🐾 PetWalking</h1>
        <nav>
          <button onClick={() => router.push('/upload')}>업로드</button>
          <button onClick={() => router.push('/profile')}>프로필</button>
          <button onClick={() => auth.signOut()}>로그아웃</button>
        </nav>
      </header>
      
      <main className="main">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>아직 게시물이 없습니다.</p>
            <button onClick={() => router.push('/upload')}>첫 게시물 올리기</button>
          </div>
        ) : (
          <div className="posts">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 