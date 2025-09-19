import { useState, useEffect } from "react";

interface Post {
  id: string;
  content: string;
  username: string;
  timestamp: string;
  avatar: string;
}

export function SocialMediaDemo() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Just integrated LIP Captcha into our platform! No more bots 🤖❌",
      username: "techfounder",
      timestamp: "2h ago",
      avatar: "👨‍💻",
    },
    {
      id: "2",
      content: "Amazing how easy it was to verify I'm human. Much better than clicking traffic lights!",
      username: "earlyuser",
      timestamp: "5h ago",
      avatar: "🚀",
    },
  ]);

  const [postContent, setPostContent] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState("");

  const handlePost = () => {
    if (!postContent.trim()) return;

    // Generate random captcha type
    const captchaTypes = ['grid', 'rotation', 'color', 'pattern'];
    const randomType = captchaTypes[Math.floor(Math.random() * captchaTypes.length)];

    // Simulate different merchant IDs (some with custom branding, some without)
    const merchantId = Math.random() > 0.5 ? 'premium-merchant' : 'free-tier';

    // Build iframe URL with parameters - using same origin with widget flag
    const url = `${window.location.origin}?widget=true&type=${randomType}&merchant=${merchantId}&theme=dark`;
    setCaptchaUrl(url);
    setShowCaptcha(true);
  };

  const handleCaptchaMessage = (event: MessageEvent) => {
    if (event.data.type === 'CAPTCHA_SUCCESS') {
      setShowCaptcha(false);

      // Add the post
      const newPost: Post = {
        id: Date.now().toString(),
        content: postContent,
        username: "currentuser",
        timestamp: "Just now",
        avatar: "😊",
      };

      setPosts([newPost, ...posts]);
      setPostContent("");

      // Show success notification
      setTimeout(() => {
        alert("✅ Post published successfully!");
      }, 100);
    }
  };

  // Listen for captcha completion
  useEffect(() => {
    window.addEventListener("message", handleCaptchaMessage);
    return () => window.removeEventListener("message", handleCaptchaMessage);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            SocialVibe <span className="text-purple-400">Demo</span>
          </h1>
          <p className="text-gray-400">
            Experience seamless human verification with LIP Captcha integration
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            Protected by LIP Captcha
          </div>
        </div>

        {/* Create Post */}
        <div className="mb-8 rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl">
              😊
            </div>
            <input
              type="text"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePost()}
              placeholder="What's on your mind?"
              className="flex-1 rounded-xl bg-gray-700/50 px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="rounded-lg px-3 py-1.5 text-gray-400 hover:bg-gray-700/50">
                📷 Photo
              </button>
              <button className="rounded-lg px-3 py-1.5 text-gray-400 hover:bg-gray-700/50">
                🎥 Video
              </button>
              <button className="rounded-lg px-3 py-1.5 text-gray-400 hover:bg-gray-700/50">
                😀 Emoji
              </button>
            </div>
            <button
              onClick={handlePost}
              disabled={!postContent.trim()}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm transition hover:bg-gray-800/70"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xl">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">@{post.username}</div>
                  <div className="text-sm text-gray-400">{post.timestamp}</div>
                </div>
                <button className="text-gray-400 hover:text-white">⋯</button>
              </div>
              <p className="mb-4 text-white">{post.content}</p>
              <div className="flex gap-6 border-t border-gray-700/50 pt-3 text-gray-400">
                <button className="hover:text-red-400">❤️ Like</button>
                <button className="hover:text-blue-400">💬 Reply</button>
                <button className="hover:text-green-400">🔄 Repost</button>
                <button className="hover:text-purple-400">📤 Share</button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="rounded-lg bg-gray-800/50 px-6 py-2 text-gray-400 hover:bg-gray-700/50">
            Load more posts...
          </button>
        </div>
      </div>

      {/* Captcha Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-gray-900 p-6">
            <button
              onClick={() => setShowCaptcha(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="mb-4 text-xl font-bold text-white">
              Verify you're human
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Complete the captcha to publish your post
            </p>
            <div className="rounded-lg bg-gray-800 p-4">
              <iframe
                src={captchaUrl}
                className="h-[400px] w-full rounded-lg"
                title="LIP Captcha"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}