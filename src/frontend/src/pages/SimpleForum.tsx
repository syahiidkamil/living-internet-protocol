import React, { useState } from "react";
import { CaptchaGatedPost } from "../components/forum/CaptchaGatedPost";
import { ThreadView } from "../components/forum/ThreadView";

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

export const SimpleForum: React.FC = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "Just won $1000 from Nike Lucky Captcha! 🎉",
      content: "This is incredible! I was just trying to post a review about sneakers and the captcha challenge was to design a custom Nike shoe. Completed it and BAM - $1000 ICP tokens! This is way better than clicking traffic lights... The future of captchas is here!",
      author: "CaptchaWinner23",
      timestamp: "2 hours ago",
      upvotes: 47,
      downvotes: 2,
      comments: 12,
      isVerified: true,
    },
    {
      id: "2", 
      title: "Living Internet Protocol vs Worldcoin - Why LIP Wins",
      content: "Been researching both projects. Worldcoin wants my iris scan (creepy!) while LIP just asks me to solve fun puzzles. Plus LIP actually pays me for verification instead of just scanning me like cattle. The lucky captcha system is genius - making verification addictive instead of annoying.",
      author: "PrivacyFirst",
      timestamp: "5 hours ago",
      upvotes: 34,
      downvotes: 8,
      comments: 23,
      isVerified: true,
    },
    {
      id: "3",
      title: "ARC-AGI challenges are actually fun!",
      content: "Never thought I'd say this about a captcha, but these pattern recognition puzzles are engaging. Way better than 'select all images with crosswalks' that take forever. And knowing I might win big makes it exciting!",
      author: "PuzzleMaster",
      timestamp: "1 day ago", 
      upvotes: 28,
      downvotes: 3,
      comments: 7,
      isVerified: true,
    },
    {
      id: "4",
      title: "Company perspective: Why we switched from Google Ads to Lucky Captcha",
      content: "We're a startup and switched our marketing budget from Google Ads to sponsoring Lucky Captcha challenges. Results: 10x more engagement, viral social sharing when people win, and users actually WANT to interact with our brand. ROI is incredible.",
      author: "StartupCMO",
      timestamp: "2 days ago",
      upvotes: 56,
      downvotes: 4,
      comments: 18,
      isVerified: true,
    },
  ]);

  const handleNewPost = (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author: "NewUser" + Math.floor(Math.random() * 1000),
      timestamp: "Just now",
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      isVerified: true,
    };
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const handleVote = (postId: string, type: "up" | "down") => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (type === "up") {
          return { ...post, upvotes: post.upvotes + 1 };
        } else {
          return { ...post, downvotes: post.downvotes + 1 };
        }
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
                🏛️ Verified Humans Community
              </h1>
              <p className="text-gray-400">
                A place where only verified humans can post. No bots, no spam, just authentic conversations.
              </p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-teal-700 hover:scale-105 border border-cyan-500/30"
            >
              ✍️ Create Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-700/50 bg-gray-800/30">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="text-gray-400">
                <span className="text-green-400 font-semibold">{posts.length}</span> posts
              </div>
              <div className="text-gray-400">
                <span className="text-blue-400 font-semibold">100%</span> verified humans
              </div>
              <div className="text-gray-400">
                <span className="text-yellow-400 font-semibold">0</span> bots detected
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs">Bot-free zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Info Banner */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-900/20 to-teal-900/20 border border-cyan-500/30 p-6">
          <h3 className="mb-3 text-lg font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            🎯 Welcome to the MVP Demo
          </h3>
          <p className="text-gray-300 mb-4">
            This forum demonstrates captcha-gated posting. Try creating a post to see the Lucky Captcha 
            system in action! All posts here are from verified humans who completed captcha challenges.
          </p>
          <div className="text-sm text-gray-400">
            In production, this would be connected to the ICP backend with real user accounts and persistent storage.
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <ThreadView
              key={post.id}
              post={post}
              onVote={(type) => handleVote(post.id, type)}
            />
          ))}
        </div>

        {/* Empty State for New Users */}
        {posts.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first verified human to start a conversation!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-3 text-white hover:from-blue-700 hover:to-teal-700 border border-cyan-500/30"
            >
              Create First Post
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CaptchaGatedPost
          onSubmit={handleNewPost}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </div>
  );
};