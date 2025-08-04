import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { User, Post } from '../types';
import PostCard from '../components/PostCard';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        // 사용자 정보 가져오기
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: auth.currentUser.uid,
            username: userDoc.data().username,
            email: userDoc.data().email,
            photoURL: userDoc.data().photoURL,
            bio: userDoc.data().bio
          });
        }

        // 사용자의 게시물 가져오기
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', auth.currentUser.uid)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🐾 프로필</h1>
        <nav>
          <button onClick={() => router.push('/')}>홈</button>
          <button onClick={() => router.push('/edit-profile')}>프로필 편집</button>
          <button onClick={() => auth.signOut()}>로그아웃</button>
        </nav>
      </header>

      <main className="main">
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">🐾</div>
              )}
            </div>
            <div className="profile-details">
              <h2>@{user.username}</h2>
              <p>{user.email}</p>
              {user.bio && <p className="bio">{user.bio}</p>}
            </div>
          </div>
        </div>

        <div className="posts-section">
          <h3>내 게시물 ({posts.length})</h3>
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
        </div>
      </main>
    </div>
  );
}
