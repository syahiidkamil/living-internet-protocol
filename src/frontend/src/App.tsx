import { useState, useEffect } from "react";
import { HumanVerificationView, ARCVerificationView, ForumView } from "./views";
import { backendService } from "./services/backendService";

type ViewType = "verification" | "arc_verification" | "forum";

function App() {
  const [view, setView] = useState<ViewType>("arc_verification");
  const [hasToken, setHasToken] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    setIsChecking(true);
    try {
      const result = await backendService.check_humanity_status();
      if ("Ok" in result) {
        const now = Date.now() * 1_000_000; // Convert to nanoseconds
        if (Number(result.Ok.expires_at) > now) {
          setHasToken(true);
          setView("forum");
        }
      }
    } catch (error) {
      console.log("No valid token found");
    }
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">Living Internet Protocol</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setView("verification")}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                view === "verification"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Old Verification
            </button>
            <button
              onClick={() => setView("arc_verification")}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                view === "arc_verification"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              ARC Verification
            </button>
            <button
              onClick={() => setView("forum")}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                view === "forum"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Forum
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === "verification" && (
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
          <HumanVerificationView />
        </div>
      )}
      {view === "arc_verification" && (
        <div className="min-h-[calc(100vh-73px)]">
          <ARCVerificationView />
        </div>
      )}
      {view === "forum" && (
        <ForumView />
      )}
    </div>
  );
}

export default App;
