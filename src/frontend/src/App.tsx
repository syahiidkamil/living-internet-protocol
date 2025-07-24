import { useState, useEffect } from "react";
import { HumanVerificationView, ForumView } from "./views";
import { backendService } from "./services/backendService";

function App() {
  const [view, setView] = useState<'verification' | 'forum'>('verification');
  const [hasToken, setHasToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    setIsChecking(true);
    try {
      const result = await backendService.check_humanity_status();
      if ('Ok' in result) {
        const now = Date.now() * 1_000_000; // Convert to nanoseconds
        if (Number(result.Ok.expires_at) > now) {
          setHasToken(true);
          setView('forum');
        }
      }
    } catch (error) {
      console.log('No valid token found');
    }
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Living Internet Protocol</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setView('verification')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'verification' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Verification
            </button>
            <button
              onClick={() => setView('forum')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'forum' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Forum
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === 'verification' ? (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
          <HumanVerificationView />
        </div>
      ) : (
        <ForumView />
      )}
    </div>
  );
}

export default App;