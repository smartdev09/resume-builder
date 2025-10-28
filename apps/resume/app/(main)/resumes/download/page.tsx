'use client'
import { useState } from 'react';

export default function DownloadPage() {
  const [linkedinId, setLinkedinId] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('dyno_32');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('linkedin');

  // Your social media accounts
  const MY_LINKEDIN_URL = 'https://linkedin.com/in/john-developer';
  const MY_GITHUB_REPO = 'https://github.com/john-developer/awesome-project';
  const MY_TWITTER_HANDLE = 'rajaaliyanahmed';

  const verifyLinkedIn = async () => {
    if (!linkedinId.trim()) {
      setVerificationStatus('Please enter your LinkedIn ID');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('Checking LinkedIn connection...');

    try {
      // Real LinkedIn API call (requires backend proxy due to CORS)
      // This would need to be implemented through your Next.js API routes
      const response = await fetch('/api/verify-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinId: linkedinId,
          targetProfile: 'john-developer' // Your LinkedIn username
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.isFollowing) {
        setIsVerified(true);
        setVerificationStatus('✅ Verified! You are connected on LinkedIn.');
      } else {
        setVerificationStatus('❌ Not verified. Please follow me on LinkedIn first.');
      }
    } catch (error) {
      // Fallback to simulation for demo purposes
      console.log('Using simulation due to API limitations');
      await simulateLinkedInCheck();
    }
    
    setIsLoading(false);
  };

  const verifyGitHub = async () => {
    if (!githubUsername.trim()) {
      setVerificationStatus('Please enter your GitHub username');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('Checking GitHub repository...');

    try {
      // Real GitHub API call
      const res = await fetch("/api/socials/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username:githubUsername }),
    });
    const watchers = await res.json();
      //@ts-ignore
      const isWatching = watchers.isWatcher
      
      if (isWatching) {
        setIsVerified(true);
        setVerificationStatus('✅ Verified! You are watching my GitHub repository.');
      } else {
        setVerificationStatus('❌ Not verified. Please watch my GitHub repository first.');
      }
    } catch (error) {
      // Fallback to simulation for demo purposes
      //@ts-ignore
      console.log('Using simulation due to API limitations:', error.message);
      await simulateGitHubCheck();
    }
    
    setIsLoading(false);
  };

  const verifyTwitter = async () => {
    if (!twitterUsername.trim()) {
      setVerificationStatus('Please enter your X (Twitter) username');
      return;
    }

    setIsLoading(true);
    setVerificationStatus('Checking X (Twitter) follow status...');

    try {
      // Real Twitter API v2 call (requires backend proxy and API keys)
     //bearer:AAAAAAAAAAAAAAAAAAAAACmh3wEAAAAAxBtbJfa73sCmZRCKyctep%2FjCYb8%3Doe3wHRkGgg3NF5KRVoUKqAtRVjqfHAqEhL1kT8MiZzYczvXgKC
      const res = await fetch("/api/socials/twitter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userX: twitterUsername }),
  });

  const data = await res.json();
      
      if (data.isFollowing) {
        setIsVerified(true);
        setVerificationStatus('✅ Verified! You are following me on X (Twitter).');
      } else {
        setVerificationStatus('❌ Not verified. Please follow me on X (Twitter) first.');
      }
    } catch (error) {
      // Fallback to simulation for demo purposes
      console.log('Using simulation due to API limitations');
      await simulateTwitterCheck();
    }
    
    setIsLoading(false);
  };

  // Simulation functions for demo purposes
  const simulateLinkedInCheck = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockFollowers = ['john.doe', 'jane.smith', 'alex.wilson'];
    const isFollowing = mockFollowers.includes(linkedinId.toLowerCase());
    
    if (isFollowing) {
      setIsVerified(true);
      setVerificationStatus('✅ Verified! You are connected on LinkedIn. (Demo mode)');
    } else {
      setVerificationStatus('❌ Not verified. Try "john.doe" for demo. Please follow me on LinkedIn first.');
    }
  };

  const simulateGitHubCheck = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockWatchers = ['johndoe123', 'janesmith456', 'alexwilson789'];
    const isWatching = mockWatchers.includes(githubUsername.toLowerCase());
    
    if (isWatching) {
      setIsVerified(true);
      setVerificationStatus('✅ Verified! You are watching my repository. (Demo mode)');
    } else {
      setVerificationStatus('❌ Not verified. Try "johndoe123" for demo. Please watch my repository first.');
    }
  };

  const simulateTwitterCheck = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockFollowers = ['johnsmith', 'janedev', 'alexcoder'];
    const isFollowing = mockFollowers.includes(twitterUsername.toLowerCase());
    
    if (isFollowing) {
      setIsVerified(true);
      setVerificationStatus('✅ Verified! You are following me on X. (Demo mode)');
    } else {
      setVerificationStatus('❌ Not verified. Try "johnsmith" for demo. Please follow me on X first.');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob(['This is your exclusive resource file content!\n\nThank you for connecting with me on social media!'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'exclusive-resource.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetVerification = () => {
    setIsVerified(false);
    setVerificationStatus('');
    setLinkedinId('');
    setGithubUsername('');
    setTwitterUsername('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Download Exclusive Resource
            </h1>
            <p className="text-lg text-gray-600">
              Connect with me on any platform to unlock the download
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg border border-pink-200">
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'linkedin'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                LinkedIn
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'github'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                GitHub
              </button>
              <button
                onClick={() => setActiveTab('twitter')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'twitter'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                X (Twitter)
              </button>
            </div>
          </div>

          {/* Verification Card */}
          <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 mb-6">
            {activeTab === 'linkedin' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  LinkedIn Verification
                </h3>
                <p className="text-gray-600 mb-6">
                  First, follow me on LinkedIn: 
                  <a href={MY_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" 
                     className="text-purple-600 hover:text-purple-800 ml-1 underline font-medium">
                    {MY_LINKEDIN_URL}
                  </a>
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter your LinkedIn ID (e.g., john.doe)"
                    value={linkedinId}
                    onChange={(e) => setLinkedinId(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-purple-400 focus:outline-none text-lg"
                    disabled={isLoading}
                  />
                  <button
                    onClick={verifyLinkedIn}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'github' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-gray-800 rounded-full mr-3"></span>
                  GitHub Verification
                </h3>
                <p className="text-gray-600 mb-6">
                  First, watch my repository: 
                  <a href={MY_GITHUB_REPO} target="_blank" rel="noopener noreferrer" 
                     className="text-purple-600 hover:text-purple-800 ml-1 underline font-medium">
                    {MY_GITHUB_REPO}
                  </a>
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter your GitHub username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-purple-400 focus:outline-none text-lg"
                    disabled={isLoading}
                  />
                  <button
                    onClick={verifyGitHub}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-gray-700 to-purple-500 text-white rounded-lg hover:from-gray-800 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'twitter' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
                  X (Twitter) Verification
                </h3>
                <p className="text-gray-600 mb-6">
                  First, follow me on X: 
                  <a href={`https://twitter.com/${MY_TWITTER_HANDLE.replace('@', '')}`} target="_blank" rel="noopener noreferrer" 
                     className="text-purple-600 hover:text-purple-800 ml-1 underline font-medium">
                    {MY_TWITTER_HANDLE}
                  </a>
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter your X username (without @)"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-lg focus:border-purple-400 focus:outline-none text-lg"
                    disabled={isLoading}
                  />
                  <button
                    onClick={verifyTwitter}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-black to-purple-500 text-white rounded-lg hover:from-gray-900 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    {isLoading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {verificationStatus && (
            <div className={`p-4 rounded-lg mb-6 text-center border-2 ${
              isVerified 
                ? 'bg-green-50 border-green-300 text-green-800' 
                : verificationStatus.includes('Demo mode') 
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-red-50 border-red-300 text-red-800'
            }`}>
              {verificationStatus}
            </div>
          )}

          {/* Download Section */}
          <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-8 text-center">
            <div className="mb-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isVerified ? 'bg-green-100 scale-110' : 'bg-gray-100'
              }`}>
                <svg className={`w-10 h-10 transition-colors duration-300 ${isVerified ? 'text-green-600' : 'text-gray-400'}`} 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {isVerified ? 'Ready to Download!' : 'Verification Required'}
              </h2>
              <p className="text-gray-600 text-lg">
                {isVerified 
                  ? 'Thank you for connecting! Your exclusive resource is ready.' 
                  : 'Choose any platform above to verify and unlock your download.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleDownload}
                disabled={!isVerified}
                className={`px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isVerified
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 shadow-xl hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isVerified ? '⬇️ Download Resource' : '🔒 Download Locked'}
              </button>
              
              {isVerified && (
                <button
                  onClick={resetVerification}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200"
                >
                  Reset Verification
                </button>
              )}
            </div>
          </div>

          {/* API Setup Instructions */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
            <h4 className="font-bold text-purple-800 mb-3 text-lg">🔧 API Setup Required:</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>For production:</strong> Create API routes in your Next.js app:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code className="bg-white px-2 py-1 rounded">/api/verify-linkedin</code> - LinkedIn API integration</li>
                <li><code className="bg-white px-2 py-1 rounded">/api/verify-github</code> - GitHub API integration (currently attempting real API)</li>
                <li><code className="bg-white px-2 py-1 rounded">/api/verify-twitter</code> - X API v2 integration</li>
              </ul>
              <p className="mt-3"><strong>Demo mode:</strong> Try "john.doe", "johndoe123", or "johnsmith" respectively</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}