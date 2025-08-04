import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostCard from '../../components/PostCard'
import { Post } from '../../types'

// Mock Firebase interactions
jest.mock('../../firebase/interactions', () => ({
  toggleLike: jest.fn(),
  addComment: jest.fn(),
  getComments: jest.fn().mockResolvedValue([]),
  getLikeCount: jest.fn().mockResolvedValue(0),
}))

// Mock Firebase auth
jest.mock('../../firebase/firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'test-user-id' },
  },
}))

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    username: 'testuser',
    imageUrl: 'https://example.com/image.jpg',
    caption: 'Test caption',
    createdAt: new Date(),
    userId: 'user1'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders post information correctly', async () => {
    await act(async () => {
      render(<PostCard post={mockPost} />)
    })
    
    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('Test caption')).toBeInTheDocument()
    expect(screen.getByAltText('post')).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('displays like count', async () => {
    await act(async () => {
      render(<PostCard post={mockPost} />)
    })
    
    await waitFor(() => {
      expect(screen.getByText(/좋아요 0/)).toBeInTheDocument()
    })
  })

  it('shows comment input', async () => {
    await act(async () => {
      render(<PostCard post={mockPost} />)
    })
    
    expect(screen.getByPlaceholderText('댓글 달기...')).toBeInTheDocument()
    expect(screen.getByText('게시')).toBeInTheDocument()
  })

  it('handles comment submission', async () => {
    const { addComment } = require('../../firebase/interactions')
    
    await act(async () => {
      render(<PostCard post={mockPost} />)
    })
    
    const commentInput = screen.getByPlaceholderText('댓글 달기...')
    const submitButton = screen.getByText('게시')
    
    await act(async () => {
      fireEvent.change(commentInput, { target: { value: 'Test comment' } })
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(addComment).toHaveBeenCalledWith('1', 'test-user-id', 'Test comment')
    })
  })

  it('handles like button click', async () => {
    const { toggleLike } = require('../../firebase/interactions')
    
    await act(async () => {
      render(<PostCard post={mockPost} />)
    })
    
    const likeButton = screen.getByText(/좋아요/)
    
    await act(async () => {
      fireEvent.click(likeButton)
    })
    
    await waitFor(() => {
      expect(toggleLike).toHaveBeenCalledWith('1', 'test-user-id')
    })
  })
}) 