
import React, { useState, useEffect } from 'react';
import { toggleLike, addComment, getComments, getLikeCount } from '../firebase/interactions';
import { auth } from '../firebase/firebaseConfig';
import { Post, Comment } from '../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const c = await getComments(post.id);
      const l = await getLikeCount(post.id);
      setComments(c);
      setLikeCount(l);
    };
    fetchData();
  }, [post.id]);

  const handleLike = async () => {
    if (!auth.currentUser) return;
    await toggleLike(post.id, auth.currentUser.uid);
    const l = await getLikeCount(post.id);
    setLikeCount(l);
  };

  const handleComment = async () => {
    if (!auth.currentUser || !comment.trim()) return;
    await addComment(post.id, auth.currentUser.uid, comment);
    setComment('');
    const c = await getComments(post.id);
    setComments(c);
  };

  return (
    <div className="post-card">
      <div className="username">@{post.username}</div>
      <img src={post.imageUrl} alt="post" className="post-image" />
      <div className="caption">{post.caption}</div>
      <button onClick={handleLike}>❤️ 좋아요 {likeCount}</button>
      <div>
        <input
          placeholder="댓글 달기..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleComment}>게시</button>
      </div>
      <div className="comments">
        {comments.map((c, index) => (
          <div key={index} className="comment">{c.userId}: {c.content}</div>
        ))}
      </div>
    </div>
  );
}
