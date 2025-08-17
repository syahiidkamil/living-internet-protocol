import React from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  isVerified: boolean;
}

interface ThreadViewProps {
  post: Post;
  onVote: (type: "up" | "down") => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({ post, onVote }) => {
  const getScoreColor = (score: number) => {
    if (score > 20) return "text-green-400";
    if (score > 5) return "text-yellow-400";
    if (score < -5) return "text-red-400";
    return "text-gray-400";
  };

  const getAuthorBadge = (author: string) => {
    if (author.includes("Winner"))
      return {
        icon: "🏆",
        color: "text-yellow-400",
        label: "Lucky Prize Winner",
      };
    if (author.includes("CMO"))
      return { icon: "💼", color: "text-blue-400", label: "Business" };
    if (author.includes("Master"))
      return { icon: "🧩", color: "text-purple-400", label: "Puzzle Expert" };
    if (author.includes("Privacy"))
      return { icon: "🔒", color: "text-green-400", label: "Privacy Advocate" };
    return { icon: "👤", color: "text-gray-400", label: "Community Member" };
  };

  const score = post.upvotes - post.downvotes;
  const badge = getAuthorBadge(post.author);

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm transition-all hover:border-gray-600/50 hover:bg-gray-800/70">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-2 text-lg leading-tight font-semibold text-white">
              {post.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className={badge.color}>{badge.icon}</span>
                <span className="font-medium text-white">{post.author}</span>
                {post.isVerified && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span className="text-xs text-green-400">
                      Verified Human
                    </span>
                  </div>
                )}
              </div>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4 leading-relaxed text-gray-300">{post.content}</div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Voting */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote("up")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-all hover:bg-green-600/20 hover:text-green-400"
              >
                ↑
              </button>

              <span className={`font-semibold ${getScoreColor(score)}`}>
                {score > 0 ? "+" : ""}
                {score}
              </span>

              <button
                onClick={() => onVote("down")}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-all hover:bg-red-600/20 hover:text-red-400"
              >
                ↓
              </button>
            </div>

            <div className="h-4 w-px bg-gray-600"></div>

            <button className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-gray-300">
              💬 {post.comments} comments
            </button>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-lg px-3 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-gray-300">
              🔗 Share
            </button>

            {post.author.includes("Winner") && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-900/20 px-2 py-1">
                <span className="text-xs text-yellow-400">
                  🎰 Lucky Prize Winner
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Special Highlights */}
        {post.title.includes("$1000") && (
          <div className="mt-4 rounded-lg border border-yellow-500/20 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-3">
            <div className="mb-1 text-xs font-semibold text-yellow-400">
              🎉 VIRAL MOMENT
            </div>
            <div className="text-xs text-gray-300">
              This lucky prize win is creating massive engagement and brand
              awareness for the sponsor!
            </div>
          </div>
        )}

        {post.title.includes("Company perspective") && (
          <div className="mt-4 rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-3">
            <div className="mb-1 text-xs font-semibold text-blue-400">
              💼 BUSINESS INSIGHT
            </div>
            <div className="text-xs text-gray-300">
              Real companies are seeing 10x ROI switching from Google Ads to
              Lucky Captcha sponsorship.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
