import { Suspense, useState, use } from 'react'

// Simulated API that returns a promise
function fetchUser(id: number): Promise<{ id: number; name: string; email: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
      })
    }, 1500)
  })
}

function fetchPosts(userId: number): Promise<{ id: number; title: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: `Post 1 by user ${userId}` },
        { id: 2, title: `Post 2 by user ${userId}` },
        { id: 3, title: `Post 3 by user ${userId}` },
      ])
    }, 2000)
  })
}

// Cache for promises to avoid refetching
const userCache = new Map<number, Promise<{ id: number; name: string; email: string }>>()
const postsCache = new Map<number, Promise<{ id: number; title: string }[]>>()

function getUserPromise(id: number) {
  if (!userCache.has(id)) {
    userCache.set(id, fetchUser(id))
  }
  return userCache.get(id)!
}

function getPostsPromise(userId: number) {
  if (!postsCache.has(userId)) {
    postsCache.set(userId, fetchPosts(userId))
  }
  return postsCache.get(userId)!
}

// Components that use the `use` hook to read promises
function UserCard({ userPromise }: { userPromise: Promise<{ id: number; name: string; email: string }> }) {
  const user = use(userPromise)

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

function PostsList({ postsPromise }: { postsPromise: Promise<{ id: number; title: string }[]> }) {
  const posts = use(postsPromise)

  return (
    <ul className="posts-list">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

function LoadingSpinner({ label }: { label: string }) {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>Loading {label}...</span>
    </div>
  )
}

export function SuspenseDemo() {
  const [userId, setUserId] = useState(1)

  const handleChangeUser = () => {
    const newId = userId + 1
    // Clear cache to show loading again
    userCache.delete(newId)
    postsCache.delete(newId)
    setUserId(newId)
  }

  return (
    <div className="demo-section">
      <h2>Suspense Demo</h2>
      <p className="demo-description">
        React 19's <code>use()</code> hook lets you read promises directly in components.
        Suspense boundaries catch the pending state and show fallback UI.
      </p>

      <button onClick={handleChangeUser} className="demo-button">
        Load User {userId + 1}
      </button>

      <div className="suspense-container">
        {/* Nested Suspense boundaries for granular loading states */}
        <Suspense fallback={<LoadingSpinner label="user" />}>
          <UserCard userPromise={getUserPromise(userId)} />

          <Suspense fallback={<LoadingSpinner label="posts" />}>
            <PostsList postsPromise={getPostsPromise(userId)} />
          </Suspense>
        </Suspense>
      </div>
    </div>
  )
}
