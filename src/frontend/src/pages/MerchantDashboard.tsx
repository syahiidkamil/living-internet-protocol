import { useState } from "react";

interface MerchantSettings {
  apiKey: string;
  siteName: string;
  siteUrl: string;
  logoUrl: string;
  primaryColor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  captchaTypes: string[];
  theme: 'light' | 'dark' | 'auto';
  subscription: 'free' | 'starter' | 'pro' | 'enterprise';
}

interface UsageStats {
  totalVerifications: number;
  successRate: number;
  botsPrevented: number;
  activeUsers: number;
}

export function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'integration' | 'analytics'>('overview');

  const [settings, setSettings] = useState<MerchantSettings>({
    apiKey: 'lip_live_8f7d6e5c4b3a2918',
    siteName: 'TechForum Pro',
    siteUrl: 'https://techforum.example.com',
    logoUrl: '',
    primaryColor: '#8B5CF6',
    difficulty: 'medium',
    captchaTypes: ['grid', 'rotation', 'color'],
    theme: 'dark',
    subscription: 'pro',
  });

  const [stats] = useState<UsageStats>({
    totalVerifications: 45892,
    successRate: 94.3,
    botsPrevented: 2847,
    activeUsers: 1284,
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const integrationCode = `<!-- LIP Captcha Widget -->
<script src="https://cdn.lip-captcha.com/v1/widget.js"></script>
<div
  id="lip-captcha"
  data-sitekey="${settings.apiKey}"
  data-theme="${settings.theme}"
  data-callback="onCaptchaSuccess">
</div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">LIP Captcha Dashboard</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                settings.subscription === 'enterprise' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                settings.subscription === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                settings.subscription === 'starter' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {settings.subscription.toUpperCase()} PLAN
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700">
                📚 Documentation
              </button>
              <button className="rounded-lg bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700">
                💬 Support
              </button>
              <button className="rounded-lg bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700">
                👤 Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-6">
            {['overview', 'settings', 'integration', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 p-6">
                <div className="mb-2 text-sm text-purple-300">Total Verifications</div>
                <div className="text-3xl font-bold text-white">{stats.totalVerifications.toLocaleString()}</div>
                <div className="mt-2 text-xs text-purple-400">↑ 12.5% from last month</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-900/50 to-green-800/30 p-6">
                <div className="mb-2 text-sm text-green-300">Success Rate</div>
                <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
                <div className="mt-2 text-xs text-green-400">Human verification accuracy</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-red-900/50 to-red-800/30 p-6">
                <div className="mb-2 text-sm text-red-300">Bots Prevented</div>
                <div className="text-3xl font-bold text-white">{stats.botsPrevented.toLocaleString()}</div>
                <div className="mt-2 text-xs text-red-400">Automated attempts blocked</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-800/30 p-6">
                <div className="mb-2 text-sm text-blue-300">Active Users</div>
                <div className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
                <div className="mt-2 text-xs text-blue-400">Last 24 hours</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <button
                  onClick={() => setActiveTab('integration')}
                  className="rounded-lg bg-gray-700/50 p-4 text-left hover:bg-gray-700"
                >
                  <div className="mb-2 text-2xl">🔧</div>
                  <div className="font-semibold text-white">Setup Integration</div>
                  <div className="text-sm text-gray-400">Add captcha to your site</div>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="rounded-lg bg-gray-700/50 p-4 text-left hover:bg-gray-700"
                >
                  <div className="mb-2 text-2xl">🎨</div>
                  <div className="font-semibold text-white">Customize Widget</div>
                  <div className="text-sm text-gray-400">Match your brand</div>
                </button>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 text-left hover:from-purple-600/30 hover:to-pink-600/30"
                >
                  <div className="mb-2 text-2xl">⚡</div>
                  <div className="font-semibold text-white">Upgrade Plan</div>
                  <div className="text-sm text-gray-400">Unlock more features</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Site Configuration */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Site Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Site URL</label>
                  <input
                    type="text"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.apiKey}
                      readOnly
                      className="flex-1 rounded-lg bg-gray-700 px-4 py-2 font-mono text-white"
                    />
                    <button className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget Customization */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Widget Customization</h2>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-400">
                  Custom Logo {settings.subscription === 'free' && <span className="text-purple-400">(Pro feature)</span>}
                </label>
                <div className="flex items-center gap-4">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Custom logo" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-700 text-gray-400">
                      No logo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={settings.subscription === 'free'}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`cursor-pointer rounded-lg px-4 py-2 ${
                      settings.subscription === 'free'
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    Upload Logo
                  </label>
                  {settings.subscription === 'free' && (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Upgrade to customize
                    </button>
                  )}
                </div>
              </div>

              {/* Other Settings */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Difficulty</label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as any })}
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Primary Color</label>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    disabled={settings.subscription === 'free'}
                    className="h-10 w-full rounded-lg bg-gray-700"
                  />
                </div>
              </div>

              {/* Captcha Types */}
              <div className="mt-4">
                <label className="mb-2 block text-sm text-gray-400">Enabled Captcha Types</label>
                <div className="flex flex-wrap gap-2">
                  {['grid', 'rotation', 'color', 'pattern', 'sequence'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const types = settings.captchaTypes.includes(type)
                          ? settings.captchaTypes.filter(t => t !== type)
                          : [...settings.captchaTypes, type];
                        setSettings({ ...settings, captchaTypes: types });
                      }}
                      className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                        settings.captchaTypes.includes(type)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold text-white hover:opacity-90">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Integration Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            {/* Integration Guide */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Quick Integration</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm text-gray-400">HTML Integration Code</label>
                    <button
                      onClick={copyToClipboard}
                      className="rounded-lg bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                    >
                      {copiedCode ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4">
                    <code className="text-sm text-gray-300">{integrationCode}</code>
                  </pre>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <h3 className="mb-2 font-semibold text-white">📦 NPM Package</h3>
                    <code className="block rounded bg-gray-900 p-2 text-sm text-gray-300">
                      npm install @lip-captcha/widget
                    </code>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <h3 className="mb-2 font-semibold text-white">🔧 WordPress Plugin</h3>
                    <button className="text-sm text-purple-400 hover:text-purple-300">
                      Download Plugin →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Examples */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Framework Examples</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {['React', 'Vue', 'Angular'].map((framework) => (
                  <button
                    key={framework}
                    className="rounded-lg bg-gray-700/50 p-4 text-left hover:bg-gray-700"
                  >
                    <div className="font-semibold text-white">{framework}</div>
                    <div className="text-sm text-gray-400">View integration guide</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Webhook Configuration */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Webhook Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Verification Webhook URL</label>
                  <input
                    type="text"
                    placeholder="https://your-site.com/webhook/lip-verify"
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Secret Key</label>
                  <input
                    type="text"
                    value="whsec_xxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="w-full rounded-lg bg-gray-700 px-4 py-2 font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-end">
              <select className="rounded-lg bg-gray-800 px-4 py-2 text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-800/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Verification Trends</h3>
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-900/50 text-gray-500">
                  📊 Chart would go here
                </div>
              </div>
              <div className="rounded-xl bg-gray-800/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Success Rate</h3>
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-900/50 text-gray-500">
                  📈 Chart would go here
                </div>
              </div>
              <div className="rounded-xl bg-gray-800/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Challenge Types Performance</h3>
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-900/50 text-gray-500">
                  🥧 Pie chart would go here
                </div>
              </div>
              <div className="rounded-xl bg-gray-800/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Geographic Distribution</h3>
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-900/50 text-gray-500">
                  🗺️ Map would go here
                </div>
              </div>
            </div>

            {/* Top Domains */}
            <div className="rounded-xl bg-gray-800/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Top Domains</h3>
              <div className="space-y-2">
                {[
                  { domain: 'app.techforum.com', verifications: 12453, rate: 95.2 },
                  { domain: 'blog.techforum.com', verifications: 8234, rate: 93.8 },
                  { domain: 'api.techforum.com', verifications: 5123, rate: 94.5 },
                ].map((item) => (
                  <div key={item.domain} className="flex items-center justify-between rounded-lg bg-gray-700/50 p-3">
                    <div>
                      <div className="font-medium text-white">{item.domain}</div>
                      <div className="text-sm text-gray-400">{item.verifications.toLocaleString()} verifications</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-400">{item.rate}%</div>
                      <div className="text-xs text-gray-400">success rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-2xl bg-gray-900 p-8">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="mb-6 text-2xl font-bold text-white">Choose Your Plan</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                {
                  name: 'Free',
                  price: '$0',
                  features: ['100 verifications/month', 'Basic captcha types', 'Standard support', 'LIP branding'],
                  current: settings.subscription === 'free',
                },
                {
                  name: 'Starter',
                  price: '$29',
                  features: ['5,000 verifications/month', 'All captcha types', 'Email support', 'Remove LIP branding'],
                  current: settings.subscription === 'starter',
                },
                {
                  name: 'Pro',
                  price: '$99',
                  features: ['50,000 verifications/month', 'Custom branding', 'Priority support', 'Advanced analytics'],
                  current: settings.subscription === 'pro',
                  popular: true,
                },
                {
                  name: 'Enterprise',
                  price: 'Custom',
                  features: ['Unlimited verifications', 'White label solution', 'Dedicated support', 'Custom features'],
                  current: settings.subscription === 'enterprise',
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border-2 p-6 ${
                    plan.current
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="text-2xl font-bold text-white">
                      {plan.price}
                      {plan.price !== 'Custom' && <span className="text-sm text-gray-400">/month</span>}
                    </div>
                  </div>
                  <ul className="mb-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-300">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full rounded-lg py-2 font-semibold ${
                      plan.current
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}