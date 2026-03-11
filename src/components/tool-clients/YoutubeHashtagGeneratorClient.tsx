'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function YoutubeHashtagGeneratorClient() {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setHashtags([]);

    if (!topic.trim()) {
      setError('Please enter a topic or keyword');
      return;
    }

    const topicClean = topic.replace(/\s+/g, '').toLowerCase();
    const topicWords = topic.toLowerCase().split(/\s+/);

    const baseHashtags = [
      `#${topicClean}`,
      '#youtube',
      '#video',
      '#tutorial',
      '#howto',
      '#tips',
      '#guide',
      '#learn',
      '#education',
      '#viral',
      '#trending',
      '#newvideo',
      '#subscribe',
    ];

    const topicSpecific = topicWords.map(word => `#${word}`);
    const allHashtags = [...new Set([...topicSpecific, ...baseHashtags])];

    setHashtags(allHashtags);
  };

  const clear = () => {
    setTopic('');
    setHashtags([]);
    setError('');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.join(' '));
  };

  const copyAllComma = () => {
    navigator.clipboard.writeText(hashtags.join(', '));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video Topic / Keyword</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Cooking, Travel Vlog, Tech Review..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Generate Hashtags</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">Clear</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{error}</p></div>}

      {hashtags.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Hashtags ({hashtags.length})</p>
              <div className="flex gap-2">
                <button onClick={copyAll} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Copy All</button>
                <button onClick={copyAllComma} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Copy (Comma)</button>
                <DownloadButton content={hashtags.join(' ')} filename="youtube-hashtags.txt" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                  <span className="text-sm text-blue-800">{tag}</span>
                  <CopyButton text={tag} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Space-separated (for YouTube)</p>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap break-words">{hashtags.join(' ')}</pre>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> YouTube allows up to 15 hashtags in your video description. The first 3 hashtags are shown above your video title.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
