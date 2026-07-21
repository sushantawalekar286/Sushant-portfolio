import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode, FaCheckCircle, FaChevronRight, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import GlassCard from './GlassCard.jsx';
import axios from 'axios';

const LEETCODE_USERNAME = 'sushantawalekar286';
const GITHUB_USERNAME = 'sushantawalekar286';
const CODOLIO_USERNAME = 'sushant';

const CodingProfiles = () => {
  const [gitStats, setGitStats] = useState({
    repos: 0,
    followers: 0,
    gists: 0,
    publicReposUrl: `https://github.com/${GITHUB_USERNAME}?tab=repositories`
  });
  
  const [leetStats, setLeetStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalEasy: 876,
    totalMedium: 1850,
    totalHard: 816,
    ranking: 0,
    loading: true
  });

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const res = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (res.data) {
          setGitStats({
            repos: res.data.public_repos,
            followers: res.data.followers,
            gists: res.data.public_gists,
            publicReposUrl: `https://github.com/${res.data.login}?tab=repositories`
          });
        }
      } catch (err) {
        // Fail silently and use default placeholders
      }
    };
    fetchGitHubStats();
  }, []);

  // Fetch real LeetCode stats
  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        const [solvedRes, profileRes] = await Promise.all([
          axios.get(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`),
          axios.get(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}`)
        ]);
        
        const solved = solvedRes.data;
        const profile = profileRes.data;
        
        setLeetStats({
          totalSolved: solved.solvedProblem || 0,
          easySolved: solved.easySolved || 0,
          mediumSolved: solved.mediumSolved || 0,
          hardSolved: solved.hardSolved || 0,
          totalEasy: 876,
          totalMedium: 1850,
          totalHard: 816,
          ranking: profile.ranking || 0,
          loading: false
        });
      } catch (err) {
        console.error('Failed to load LeetCode stats:', err);
        setLeetStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchLeetCodeStats();
  }, []);

  // Compute dynamic percentages
  const totalProblems = leetStats.totalEasy + leetStats.totalMedium + leetStats.totalHard;
  const easyPct = leetStats.totalEasy > 0 ? Math.round((leetStats.easySolved / leetStats.totalEasy) * 100) : 0;
  const mediumPct = leetStats.totalMedium > 0 ? Math.round((leetStats.mediumSolved / leetStats.totalMedium) * 100) : 0;
  const hardPct = leetStats.totalHard > 0 ? Math.round((leetStats.hardSolved / leetStats.totalHard) * 100) : 0;
  const solvedRatio = totalProblems > 0 ? leetStats.totalSolved / totalProblems : 0;

  const formatRanking = (rank) => {
    if (!rank) return 'N/A';
    return rank.toLocaleString();
  };

  return (
    <div className="py-12 border-t border-slate-200/50 dark:border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <h3 className="text-xl font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 text-center mb-8 flex items-center justify-center gap-2">
          <FaCode className="text-primary-500" /> Coding Profiles
        </h3>

        {/* Top row — GitHub + LeetCode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* GitHub Stats Card */}
          <GlassCard hoverEffect={true} className="p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-slate-900 text-white text-xl">
                    <FaGithub />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm">GitHub Statistics</h4>
                    <p className="text-xxs text-slate-400">Public contributions & repos</p>
                  </div>
                </div>
                <a 
                  href={gitStats.publicReposUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-1"
                >
                  View Profile <FaChevronRight className="w-2 h-2" />
                </a>
              </div>

              {/* Stats values */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4">
                <div className="text-center bg-slate-50/50 dark:bg-dark-950/40 p-2 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{gitStats.repos}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Repositories</p>
                </div>
                <div className="text-center bg-slate-50/50 dark:bg-dark-950/40 p-2 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{gitStats.followers}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Followers</p>
                </div>
                <div className="text-center bg-slate-50/50 dark:bg-dark-950/40 p-2 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <p className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{gitStats.gists}</p>
                  <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gists</p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1 mt-4">
              <FaCheckCircle className="text-emerald-500" /> Updates automatically from GitHub API
            </div>
          </GlassCard>

          {/* LeetCode Stats Card */}
          <GlassCard hoverEffect={true} className="p-6 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 text-xl border border-amber-500/15">
                    <FaCode />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm">LeetCode Stats</h4>
                    <p className="text-xxs text-slate-400">Algorithmic problem solving</p>
                  </div>
                </div>
                <a 
                  href={`https://leetcode.com/u/${LEETCODE_USERNAME}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-1"
                >
                  Solve Problems <FaChevronRight className="w-2 h-2" />
                </a>
              </div>

              {leetStats.loading ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin text-amber-500 text-2xl" />
                </div>
              ) : (
                <>
                  {/* Total solved details */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" className="stroke-slate-200 dark:stroke-dark-800 fill-none" strokeWidth="6" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="32" 
                          className="stroke-amber-500 fill-none" 
                          strokeWidth="6" 
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - solvedRatio)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-lg font-black text-slate-800 dark:text-white leading-none">{leetStats.totalSolved}</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Solved</p>
                      </div>
                    </div>

                    {/* Categories break-down */}
                    <div className="w-full sm:flex-1 space-y-1.5 text-[10px] font-bold">
                      <div className="flex justify-between items-center text-emerald-500">
                        <span>Easy: {leetStats.easySolved}</span>
                        <span>{easyPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${easyPct}%` }} />
                      </div>
                      
                      <div className="flex justify-between items-center text-amber-500 mt-2">
                        <span>Medium: {leetStats.mediumSolved}</span>
                        <span>{mediumPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${mediumPct}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-red-500 mt-2">
                        <span>Hard: {leetStats.hardSolved}</span>
                        <span>{hardPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all duration-700" style={{ width: `${hardPct}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-[10px] text-slate-400 font-semibold italic flex items-center justify-between mt-6 border-t border-slate-100 dark:border-slate-850 pt-3">
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-emerald-500" /> Live from LeetCode API
              </span>
              <span>Global Rank: <strong className="text-slate-650 dark:text-slate-300 font-black">{formatRanking(leetStats.ranking)}</strong></span>
            </div>
          </GlassCard>

        </div>

        {/* Codolio Profile Card — full width below */}
        <div className="max-w-4xl mx-auto mt-8">
          <GlassCard hoverEffect={true} className="p-6 text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              
              {/* Codolio OG card preview */}
              <a
                href={`https://codolio.com/profile/${CODOLIO_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <img
                  src={`https://codolio.com/api/og/${CODOLIO_USERNAME}`}
                  alt="Codolio Profile Card"
                  className="w-full h-auto object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </a>

              {/* Info side */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 text-xl border border-violet-500/15">
                    <FaCode />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm">Codolio Portfolio</h4>
                    <p className="text-xxs text-slate-400">Unified coding profile tracker</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Aggregated coding stats across LeetCode, GeeksforGeeks, Codeforces, and more — all in one place. Track questions solved, contest performance, and coding streaks.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['LeetCode', 'GFG', 'Codeforces', 'CodeChef'].map(platform => (
                    <span 
                      key={platform}
                      className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-[9px] font-bold uppercase tracking-wider text-violet-500 border border-violet-500/10"
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://codolio.com/profile/${CODOLIO_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-violet-500/20"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                  View Full Codolio Profile
                </a>
              </div>

            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default CodingProfiles;
