import React, { useState, useEffect } from 'react';
import { backendService, Post, HumanityToken } from '../services/backendService';
import { CreatePostModal } from '../components/CreatePostModal';
import { PostCard } from '../components/PostCard';
import { TokenStatusBadge } from '../components/TokenStatusBadge';
import { HumanVerificationView } from './HumanVerificationView';
import { Loader } from '../components';

export const ForumView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<HumanityToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
    checkTokenStatus();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await backendService.get_all_posts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
    }
  };

  const checkTokenStatus = async () => {
    setIsLoading(true);
    try {
      const result = await backendService.check_humanity_status();
      if ('Ok' in result) {
        setTokenStatus(result.Ok);
      } else {
        setTokenStatus(null);
      }
    } catch (error) {
      setTokenStatus(null);
    }
    setIsLoading(false);
  };

  const handleCreatePost = async (title: string, content: string) => {
    try {
      const result = await backendService.create_post(title, content);
      if ('Err' in result && result.Err === 'CHALLENGE_REQUIRED') {
        setShowCreateModal(false);
        setShowChallenge(true);
      } else if ('Ok' in result) {
        await loadPosts();
        setShowCreateModal(false);
      } else if ('Err' in result) {
        alert(`Error: ${result.Err}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleChallengeComplete = async (success: boolean) => {
    if (success) {
      await checkTokenStatus();
      setShowChallenge(false);
      setShowCreateModal(true);
    } else {
      // Logout on failure
      window.location.href = '/';
    }
  };

  const isTokenValid = () => {
    if (!tokenStatus) return false;
    const now = Date.now() * 1_000_000; // Convert to nanoseconds
    return Number(tokenStatus.expires_at) > now;
  };

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-semibold">Verified Humans Forum</h2>
          <div className="flex items-center gap-4">
            <TokenStatusBadge token={tokenStatus} />
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts yet. Be the first verified human to post!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreatePostModal
          onSubmit={handleCreatePost}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold p-4 border-b border-gray-700">
              Humanity Verification Required
            </h2>
            <p className="p-4 text-gray-300">Your verification expired. Complete this challenge to continue.</p>
            <HumanVerificationView
              mode="refresh"
              onComplete={handleChallengeComplete}
            />
          </div>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
};