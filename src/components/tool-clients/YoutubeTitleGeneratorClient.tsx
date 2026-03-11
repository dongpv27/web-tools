'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function YoutubeTitleGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setTitles([]);

    if (!topic.trim()) {
      setError('Please enter a topic or keyword');
      return;
    }

    const topicLower = topic.toLowerCase();
    const templates = [
      `How to ${topicLower} - Complete Guide for Beginners`,
      `${topic} Tutorial: Everything You Need to Know`,
      `10 ${topicLower} Tips That Will Change Your Life`,
      `The Ultimate ${topic} Guide (2024)`,
      `${topic} for Beginners - Step by Step`,
      `Why ${topic} is Important and How to Master It`,
      `${topic} Secrets Revealed!`,
      `Master ${topic} in Just 10 Minutes`,
      `${topic} Mistakes to Avoid (Don't Do This!)`,
      `Best ${topic} Strategies That Actually Work`,
      `${topic} vs The Competition - Honest Comparison`,
      `My ${topic} Journey: From Beginner to Pro`,
      `5 ${topicLower} Hacks You Need to Know`,
      `Is ${topic} Worth It? Honest Review`,
      `${topic} Explained in Simple Terms`,
    ];

    setTitles(templates);
  };

  const clear = () => {
    setTopic('');
    setTitles([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video Topic / Keyword</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Cooking, Photography, Python Programming..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate Titles</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {titles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Click on a title to copy it</p>
            <DownloadButton content={titles.join('\n')} filename="youtube-titles.txt" />
          </div>
          {titles.map((title, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <span className="text-sm text-gray-800">{title}</span>
              <CopyButton text={title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
