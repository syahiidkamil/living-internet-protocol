import React from 'react';
import { Post } from '../services/backendService';

interface Props {
  post: Post;
}

export const PostCard: React.FC<Props> = ({ post }) => {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000); // Convert from nanoseconds
    return date.toLocaleString();
  };

  const truncateAuthor = (author: string) => {
    if (author.length > 20) {
      return `${author.slice(0, 8)}...${author.slice(-8)}`;
    }
    return author;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              {post.author_verified && (
                <span className="text-green-500" title="Verified Human">✓</span>
              )}
              <span title={post.author}>{truncateAuthor(post.author)}</span>
            </span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-gray-300 whitespace-pre-wrap break-words">
        {post.content}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          <span className="mr-1">💬</span> Reply
        </button>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          <span className="mr-1">⬆️</span> Upvote
        </button>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          <span className="mr-1">🔗</span> Share
        </button>
      </div>
    </div>
  );
};