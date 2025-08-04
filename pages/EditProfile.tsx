import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase/firebaseConfig';
import { User } from '../types';

export default function EditProfile() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        const userDoc = await fetch(`/api/users/${auth.currentUser.uid}`);
        if (userDoc.ok) {
          const userData = await userDoc.json();
          setUsername(userData.username || '');
          setBio(userData.bio || '');
          setPhotoPreview(userData.photoURL || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    setError('');

    try {
      let photoURL = photoPreview;

      // 새 프로필 사진이 선택된 경우 업로드
      if (photoFile) {
        const photoRef = ref(storage, `profiles/${auth.currentUser.uid}/${Date.now()}_${photoFile.name}`);
        const snapshot = await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Firebase Auth 프로필 업데이트
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photoURL
      });

      // Firestore 사용자 정보 업데이트
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        username: username,
        bio: bio,
        photoURL: photoURL,
        updatedAt: new Date()
      });

      router.push('/profile');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🐾 프로필 편집</h1>
        <button onClick={() => router.push('/profile')}>취소</button>
      </header>

      <main className="main">
        <div className="edit-profile-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="photo">프로필 사진</label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <div className="photo-preview">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username">사용자명</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="사용자명을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">소개</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="자신을 소개해보세요..."
                rows={4}
              />
            </div>

            <button type="submit" disabled={loading} className="save-button">
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
