import React from "react";
import { Post } from "../services/backendService";

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
    <div className="hover:bg-gray-750 rounded-lg bg-gray-800 p-6 transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              {post.author_verified && (
                <span className="text-green-500" title="Verified Human">
                  ✓
                </span>
              )}
              <span title={post.author}>{truncateAuthor(post.author)}</span>
            </span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="break-words whitespace-pre-wrap text-gray-300">
        {post.content}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-gray-700 pt-4">
        <button className="text-sm text-gray-400 transition-colors hover:text-white">
          <span className="mr-1">💬</span> Reply
        </button>
        <button className="text-sm text-gray-400 transition-colors hover:text-white">
          <span className="mr-1">⬆️</span> Upvote
        </button>
        <button className="text-sm text-gray-400 transition-colors hover:text-white">
          <span className="mr-1">🔗</span> Share
        </button>
      </div>
    </div>
  );
};
