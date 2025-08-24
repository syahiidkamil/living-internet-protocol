import React, { useState } from "react";

type TabType = "security" | "lucky" | "providers";

interface SecurityProvider {
  id: string;
  name: string;
  staked: string;
  uptime: string;
  rating: number;
  pricing: string;
  icon: string;
}

interface LuckyCampaign {
  id: string;
  name: string;
  sponsor: string;
  prizePool: string;
  participants: number;
  timeLeft: string;
  icon: string;
  featured: boolean;
}

export const CaptchaMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("security");
  const [monthlyCallsInput, setMonthlyCallsInput] = useState("100000");

  const securityProviders: SecurityProvider[] = [
    {
      id: "google-recaptcha",
      name: "Google reCAPTCHA",
      staked: "100 ICP",
      uptime: "99.9%",
      rating: 5,
      pricing: "$0.0005/call",
      icon: "🚦",
    },
    {
      id: "hcaptcha",
      name: "hCaptcha",
      staked: "75 ICP",
      uptime: "99.7%",
      rating: 4,
      pricing: "$0.0007/call",
      icon: "🔒",
    },
    {
      id: "cloudflare-turnstile",
      name: "Cloudflare Turnstile",
      staked: "50 ICP",
      uptime: "99.8%",
      rating: 5,
      pricing: "$0.0004/call",
      icon: "⚡",
    },
    {
      id: "lip-arc-agi",
      name: "LIP ARC-AGI",
      staked: "200 ICP",
      uptime: "99.9%",
      rating: 4,
      pricing: "$0.0003/call",
      icon: "🧩",
    },
  ];

  const luckyCampaigns: LuckyCampaign[] = [
    {
      id: "nikex-design",
      name: "Nikex Design Challenge",
      sponsor: "Nikex",
      prizePool: "$10,000 ICP • 0.1% win rate",
      participants: 28470,
      timeLeft: "5d 12h",
      icon: "👟",
      featured: true,
    },
    {
      id: "arc-agi-puzzle",
      name: "ARC-AGI Puzzle Challenge",
      sponsor: "Open Source",
      prizePool: "$5,000 ICP • 0.01% win rate",
      participants: 45680,
      timeLeft: "12d 6h",
      icon: "🧩",
      featured: false,
    },
    {
      id: "creative-logo",
      name: "Creative Logo Challenge",
      sponsor: "StartupX",
      prizePool: "$2,500 ICP • 1% win rate",
      participants: 12050,
      timeLeft: "3d 18h",
      icon: "🎨",
      featured: false,
    },
  ];

  const calculatePrice = (calls: number) => {
    if (calls <= 10000) return { plan: "Free", price: "$0", perCall: "$0" };
    if (calls <= 100000)
      return { plan: "Starter", price: "$19", perCall: "$0.00019" };
    if (calls <= 1000000)
      return { plan: "Growth", price: "$99", perCall: "$0.000099" };
    if (calls <= 10000000)
      return { plan: "Business", price: "$399", perCall: "$0.0000399" };
    return { plan: "Enterprise", price: "Custom", perCall: "Volume discount" };
  };

  const monthlyCallsNum = parseInt(monthlyCallsInput) || 0;
  const recommendation = calculatePrice(monthlyCallsNum);

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center">
            <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
              🛒 Captcha Marketplace
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              Secure • Fair • Profitable - Powered by Internet Computer
            </p>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-blue-500/30 bg-blue-900/20 p-6">
                <div className="text-2xl font-bold text-blue-400">$2M+</div>
                <div className="text-sm text-gray-400">Revenue Secured</div>
              </div>
              <div className="rounded-xl border border-purple-500/30 bg-purple-900/20 p-6">
                <div className="text-2xl font-bold text-purple-400">15+</div>
                <div className="text-sm text-gray-400">Active Providers</div>
              </div>
              <div className="rounded-xl border border-pink-500/30 bg-pink-900/20 p-6">
                <div className="text-2xl font-bold text-pink-400">50K+</div>
                <div className="text-sm text-gray-400">Verified Humans</div>
              </div>
              <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-6">
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("security")}
              className={`rounded-t-lg px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "security"
                  ? "border-b-2 border-blue-500 bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              🛡️ Security Captchas
            </button>
            <button
              onClick={() => setActiveTab("lucky")}
              className={`rounded-t-lg px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "lucky"
                  ? "border-b-2 border-purple-500 bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              🎰 Lucky Captchas
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`rounded-t-lg px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "providers"
                  ? "border-b-2 border-green-500 bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              🏪 Provider Registry
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Security Captchas Tab */}
        {activeTab === "security" && (
          <div className="space-y-8">
            {/* Pricing Calculator */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                💰 Pricing Calculator
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Expected Monthly Calls
                  </label>
                  <input
                    type="number"
                    value={monthlyCallsInput}
                    onChange={(e) => setMonthlyCallsInput(e.target.value)}
                    placeholder="100000"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-4">
                  <div className="text-lg font-semibold text-white">
                    Recommended Plan: {recommendation.plan}
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {recommendation.price}/month
                  </div>
                  <div className="text-sm text-gray-400">
                    Cost per call: {recommendation.perCall}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">
                📊 Subscription Plans
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-xl border border-gray-600 bg-gray-800/50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Free
                  </h3>
                  <div className="mb-4 text-3xl font-bold text-green-400">
                    $0
                  </div>
                  <div className="mb-4 space-y-2 text-sm text-gray-300">
                    <div>• 10K calls/month</div>
                    <div>• Basic support</div>
                    <div>• Standard SLA</div>
                  </div>
                  <button className="w-full rounded-lg border border-green-500 bg-green-600/20 px-4 py-2 text-green-400 hover:bg-green-600/30">
                    Get Started
                  </button>
                </div>

                <div className="rounded-xl border border-blue-500/50 bg-blue-900/20 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Starter
                  </h3>
                  <div className="mb-4 text-3xl font-bold text-blue-400">
                    $19
                  </div>
                  <div className="mb-4 space-y-2 text-sm text-gray-300">
                    <div>• 100K calls/month</div>
                    <div>• Analytics dashboard</div>
                    <div>• Email support</div>
                  </div>
                  <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-white hover:from-blue-700 hover:to-cyan-600">
                    Choose Plan
                  </button>
                </div>

                <div className="relative rounded-xl border border-purple-500/50 bg-purple-900/20 p-6">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white">
                    POPULAR
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Growth
                  </h3>
                  <div className="mb-4 text-3xl font-bold text-purple-400">
                    $99
                  </div>
                  <div className="mb-4 space-y-2 text-sm text-gray-300">
                    <div>• 1M calls/month</div>
                    <div>• Priority support</div>
                    <div>• Advanced analytics</div>
                  </div>
                  <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-white hover:from-purple-700 hover:to-pink-600">
                    Choose Plan
                  </button>
                </div>

                <div className="rounded-xl border border-yellow-500/50 bg-yellow-900/20 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Business
                  </h3>
                  <div className="mb-4 text-3xl font-bold text-yellow-400">
                    $399
                  </div>
                  <div className="mb-4 space-y-2 text-sm text-gray-300">
                    <div>• 10M calls/month</div>
                    <div>• Dedicated support</div>
                    <div>• Custom integrations</div>
                  </div>
                  <button className="w-full rounded-lg bg-gradient-to-r from-yellow-600 to-orange-500 px-4 py-2 text-white hover:from-yellow-700 hover:to-orange-600">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>

            {/* Available Providers */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">
                🔐 Available Captcha Providers
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-600 bg-gray-800/50">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Staked
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Uptime
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Pricing
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityProviders.map((provider) => (
                      <tr
                        key={provider.id}
                        className="border-t border-gray-700/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{provider.icon}</div>
                            <div className="font-medium text-white">
                              {provider.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-400">
                          {provider.staked}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-400">
                          {provider.uptime}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {renderStars(provider.rating)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-yellow-400">
                          {provider.pricing}
                        </td>
                        <td className="px-6 py-4">
                          <button className="rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-sm text-blue-400 hover:bg-blue-600/30">
                            Integrate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Lucky Captchas Tab */}
        {activeTab === "lucky" && (
          <div className="space-y-8">
            {/* For Brands Section */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                🎯 Launch Your Brand Campaign
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Campaign Budget
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Challenge Type
                    </label>
                    <select className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                      <option>Design Challenge</option>
                      <option>Puzzle Challenge</option>
                      <option>Creative Contest</option>
                      <option>Skill Test</option>
                    </select>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Campaign Preview
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Campaign Budget:</span>
                      <span className="text-white">$5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee (25%):</span>
                      <span className="text-yellow-400">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prize Pool (75%):</span>
                      <span className="text-green-400">$3,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Est. Reach (0.1% win):
                      </span>
                      <span className="text-blue-400">37,500 people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Cost per engagement:
                      </span>
                      <span className="text-purple-400">
                        $0.13 vs $0.50 Google
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-white hover:from-purple-700 hover:to-pink-600">
                    Launch Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* IC Randomness Guarantee */}
            <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="text-4xl">🎲</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Powered by Internet Computer VRF
                  </h2>
                  <p className="text-gray-300">
                    Verifiable, Fair, and Tamper-Proof Randomness
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-3xl">🔒</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Cryptographically Secure
                  </h3>
                  <p className="text-sm text-gray-400">
                    Uses IC's VRF for unbiased random number generation
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">✅</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Publicly Verifiable
                  </h3>
                  <p className="text-sm text-gray-400">
                    All randomness proofs stored on-chain for transparency
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl">🛡️</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Manipulation-Proof
                  </h3>
                  <p className="text-sm text-gray-400">
                    No single party can influence or predict outcomes
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-gray-600 bg-gray-800/50 p-4">
                <code className="text-sm text-green-400">
                  {`// Example: IC Randomness Integration
let random_bytes = ic_cdk::api::management_canister::main::raw_rand().await?;
let win_result = verify_fair_outcome(user_id, random_bytes, campaign_settings);`}
                </code>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://internetcomputer.org/docs/building-apps/network-features/randomness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  📚 Learn more about IC Randomness →
                </a>
              </div>
            </div>

            {/* Active Campaigns */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-white">
                🎰 Active Lucky Campaigns
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {luckyCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`rounded-xl border p-6 transition-all hover:scale-105 ${
                      campaign.featured
                        ? "border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20"
                        : "border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    {campaign.featured && (
                      <div className="mb-3 text-xs font-semibold text-purple-400">
                        🌟 FEATURED
                      </div>
                    )}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="text-3xl">{campaign.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {campaign.name}
                        </h3>
                        <div className="text-sm text-gray-400">
                          by {campaign.sponsor}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prize Pool:</span>
                        <span className="font-semibold text-green-400">
                          {campaign.prizePool}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-blue-400">
                          {campaign.participants.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Left:</span>
                        <span className="text-yellow-400">
                          {campaign.timeLeft}
                        </span>
                      </div>
                    </div>
                    <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white hover:from-blue-700 hover:to-purple-700">
                      Join Challenge
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                📈 Campaign Success Metrics
              </h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">70%</div>
                  <div className="text-sm text-gray-400">
                    Lower Cost vs Google Ads
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">85%</div>
                  <div className="text-sm text-gray-400">
                    Brand Recall (30 days)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">12x</div>
                  <div className="text-sm text-gray-400">
                    Higher Engagement Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    $0.13
                  </div>
                  <div className="text-sm text-gray-400">
                    Cost per Engagement
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Registry Tab */}
        {activeTab === "providers" && (
          <div className="space-y-8">
            {/* Become a Provider */}
            <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                🚀 Become a Captcha Provider
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💰</div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Earn 75% Revenue Share
                      </h3>
                      <p className="text-sm text-gray-400">
                        Keep majority of revenue from your captcha solutions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Stake ICP Tokens
                      </h3>
                      <p className="text-sm text-gray-400">
                        Build trust through tokenized commitment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Transparent Metrics
                      </h3>
                      <p className="text-sm text-gray-400">
                        Performance tracked and displayed publicly
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-white">
                        Enterprise Access
                      </h3>
                      <p className="text-sm text-gray-400">
                        Connect with high-value customers instantly
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-600 bg-gray-800/50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Provider Requirements
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-gray-300">
                        Minimum 50 ICP stake
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-gray-300">99%+ uptime SLA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-gray-300">API documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span className="text-gray-300">Security audit</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 text-white hover:from-green-700 hover:to-blue-700">
                    Apply to Become Provider
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Mechanisms */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                🛡️ Trust & Security Framework
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mb-3 text-3xl">💰</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Smart Contract Escrow
                  </h3>
                  <p className="text-sm text-gray-400">
                    Payments held securely until service delivered
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 text-3xl">🔐</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Staking Insurance
                  </h3>
                  <p className="text-sm text-gray-400">
                    Provider stakes slashed for fraud or poor performance
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 text-3xl">📊</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Performance SLAs
                  </h3>
                  <p className="text-sm text-gray-400">
                    Automated monitoring and enforcement
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-3 text-3xl">⭐</div>
                  <h3 className="mb-2 font-semibold text-white">
                    Community Reviews
                  </h3>
                  <p className="text-sm text-gray-400">
                    Transparent rating system for providers
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Model */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-900/10 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">
                💸 Revenue Sharing Model
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-4 text-6xl">75%</div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Provider Revenue
                  </h3>
                  <p className="text-sm text-gray-400">
                    You keep the majority of earnings from your captcha services
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-6xl">25%</div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Platform Fee
                  </h3>
                  <p className="text-sm text-gray-400">
                    LIP fee covers infrastructure, security, and marketplace
                    operations
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4 text-6xl">0%</div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Hidden Fees
                  </h3>
                  <p className="text-sm text-gray-400">
                    No surprise charges - transparent revenue split
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="border-t border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                For Developers
              </h2>
              <div className="space-y-3 text-gray-300">
                <div>1. Choose your captcha provider</div>
                <div>2. Get API keys instantly</div>
                <div>3. Integrate in under 5 minutes</div>
                <div>4. Scale with confidence</div>
              </div>
              <button className="mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 text-white hover:from-blue-700 hover:to-cyan-600">
                View API Docs
              </button>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">For Brands</h2>
              <div className="space-y-3 text-gray-300">
                <div>1. Set your engagement budget</div>
                <div>2. Design fun challenges</div>
                <div>3. Users play & win rewards</div>
                <div>4. Track brand impact metrics</div>
              </div>
              <button className="mt-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3 text-white hover:from-purple-700 hover:to-pink-600">
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
