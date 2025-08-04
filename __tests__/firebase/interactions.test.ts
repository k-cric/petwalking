import {
  toggleLike,
  addComment,
  followUser,
  getComments,
  getLikeCount
} from '../../firebase/interactions'

// Mock Firebase Firestore
jest.mock('../../firebase/firebaseConfig', () => ({
  db: {},
}))

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}))

describe('Firebase Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('toggleLike', () => {
    it('should add like when user has not liked the post', async () => {
      const { doc, setDoc, getDoc } = require('firebase/firestore')
      const mockDoc = { exists: () => false }
      const mockDocRef = {}
      getDoc.mockResolvedValue(mockDoc)
      doc.mockReturnValue(mockDocRef)

      await toggleLike('post1', 'user1')

      expect(doc).toHaveBeenCalledWith({}, 'posts/post1/likes', 'user1')
      expect(setDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          userId: 'user1',
          createdAt: expect.any(Date)
        })
      )
    })

    it('should remove like when user has already liked the post', async () => {
      const { doc, deleteDoc, getDoc } = require('firebase/firestore')
      const mockDoc = { exists: () => true }
      const mockDocRef = {}
      getDoc.mockResolvedValue(mockDoc)
      doc.mockReturnValue(mockDocRef)

      await toggleLike('post1', 'user1')

      expect(doc).toHaveBeenCalledWith({}, 'posts/post1/likes', 'user1')
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef)
    })
  })

  describe('addComment', () => {
    it('should add comment to post', async () => {
      const { addDoc, collection } = require('firebase/firestore')
      const mockCollectionRef = {}
      collection.mockReturnValue(mockCollectionRef)

      await addComment('post1', 'user1', 'Test comment')

      expect(collection).toHaveBeenCalledWith({}, 'posts/post1/comments')
      expect(addDoc).toHaveBeenCalledWith(
        mockCollectionRef,
        expect.objectContaining({
          userId: 'user1',
          content: 'Test comment',
          createdAt: expect.any(Date)
        })
      )
    })
  })

  describe('followUser', () => {
    it('should create follow relationship', async () => {
      const { setDoc, doc } = require('firebase/firestore')
      const mockDocRef1 = {}
      const mockDocRef2 = {}
      doc.mockReturnValueOnce(mockDocRef1).mockReturnValueOnce(mockDocRef2)

      await followUser('user1', 'user2')

      expect(setDoc).toHaveBeenCalledTimes(2)
      expect(doc).toHaveBeenCalledWith({}, 'follows/user1/following', 'user2')
      expect(doc).toHaveBeenCalledWith({}, 'follows/user2/followers', 'user1')
    })
  })

  describe('getComments', () => {
    it('should return comments array', async () => {
      const { getDocs, collection } = require('firebase/firestore')
      const mockSnapshot = {
        docs: [
          { data: () => ({ userId: 'user1', content: 'Comment 1' }) },
          { data: () => ({ userId: 'user2', content: 'Comment 2' }) }
        ]
      }
      getDocs.mockResolvedValue(mockSnapshot)

      const result = await getComments('post1')

      expect(collection).toHaveBeenCalledWith({}, 'posts/post1/comments')
      expect(result).toEqual([
        { userId: 'user1', content: 'Comment 1' },
        { userId: 'user2', content: 'Comment 2' }
      ])
    })
  })

  describe('getLikeCount', () => {
    it('should return like count', async () => {
      const { getDocs, collection } = require('firebase/firestore')
      const mockSnapshot = { size: 5 }
      getDocs.mockResolvedValue(mockSnapshot)

      const result = await getLikeCount('post1')

      expect(collection).toHaveBeenCalledWith({}, 'posts/post1/likes')
      expect(result).toBe(5)
    })
  })
}) 