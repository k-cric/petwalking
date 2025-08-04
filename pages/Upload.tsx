import { useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, storage, db } from '../firebase/firebaseConfig';

export default function Upload() {
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !image) return;

    setLoading(true);
    setError('');

    try {
      // 이미지 업로드
      const imageRef = ref(storage, `posts/${auth.currentUser.uid}/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Firestore에 포스트 저장
      await addDoc(collection(db, 'posts'), {
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName || 'Unknown',
        imageUrl: imageUrl,
        caption: caption,
        createdAt: serverTimestamp()
      });

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🐾 새 게시물 업로드</h1>
        <button onClick={() => router.push('/')}>홈으로</button>
      </header>

      <main className="main">
        <div className="upload-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="image">이미지 선택</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {image && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="caption">캡션</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="반려동물과의 특별한 순간을 공유해보세요..."
                rows={4}
                required
              />
            </div>

            <button type="submit" disabled={loading || !image} className="upload-button">
              {loading ? '업로드 중...' : '게시하기'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
