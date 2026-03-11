'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface ParsedUserAgent {
  browser: { name: string; version: string; major: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
  cpu: { architecture: string };
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isBot: boolean;
}

export default function UserAgentParserClient() {
  const [input, setInput] = useState('');

  const parsedUA = useMemo((): ParsedUserAgent | null => {
    if (!input.trim()) return null;

    const ua = input.trim();
    const result: ParsedUserAgent = {
      browser: { name: 'Unknown', version: '', major: '' },
      os: { name: 'Unknown', version: '' },
      device: { type: 'Unknown', vendor: '', model: '' },
      engine: { name: '', version: '' },
      cpu: { architecture: '' },
      isMobile: false,
      isTablet: false,
      isDesktop: false,
      isBot: false,
    };

    // Detect browser
    if (/Chrome\/[\d.]+/.test(ua) && !/Edg/.test(ua)) {
      const match = ua.match(/Chrome\/([\d.]+)/);
      result.browser.name = 'Chrome';
      result.browser.version = match?.[1] || '';
      result.browser.major = match?.[1]?.split('.')[0] || '';
      result.engine.name = 'Blink';
    } else if (/Edg\/[\d.]+/.test(ua)) {
      const match = ua.match(/Edg\/([\d.]+)/);
      result.browser.name = 'Edge';
      result.browser.version = match?.[1] || '';
      result.browser.major = match?.[1]?.split('.')[0] || '';
      result.engine.name = 'Blink';
    } else if (/Firefox\/[\d.]+/.test(ua)) {
      const match = ua.match(/Firefox\/([\d.]+)/);
      result.browser.name = 'Firefox';
      result.browser.version = match?.[1] || '';
      result.browser.major = match?.[1]?.split('.')[0] || '';
      result.engine.name = 'Gecko';
    } else if (/Safari\/[\d.]+/.test(ua) && !/Chrome/.test(ua)) {
      const match = ua.match(/Version\/([\d.]+)/);
      result.browser.name = 'Safari';
      result.browser.version = match?.[1] || '';
      result.browser.major = match?.[1]?.split('.')[0] || '';
      result.engine.name = 'WebKit';
    } else if (/Opera|OPR\//.test(ua)) {
      const match = ua.match(/(?:Opera|OPR)\/([\d.]+)/);
      result.browser.name = 'Opera';
      result.browser.version = match?.[1] || '';
      result.browser.major = match?.[1]?.split('.')[0] || '';
    }

    // Detect OS
    if (/Windows NT ([\d.]+)/.test(ua)) {
      const match = ua.match(/Windows NT ([\d.]+)/);
      result.os.name = 'Windows';
      result.os.version = match?.[1] === '10.0' ? '10/11' : match?.[1] || '';
      result.isDesktop = true;
    } else if (/Mac OS X ([\d_]+)/.test(ua)) {
      const match = ua.match(/Mac OS X ([\d_]+)/);
      result.os.name = 'macOS';
      result.os.version = match?.[1]?.replace(/_/g, '.') || '';
      result.isDesktop = true;
    } else if (/Android ([\d.]+)/.test(ua)) {
      const match = ua.match(/Android ([\d.]+)/);
      result.os.name = 'Android';
      result.os.version = match?.[1] || '';
      result.isMobile = true;
    } else if (/iPhone OS ([\d_]+)/.test(ua) || /iPad.*OS ([\d_]+)/.test(ua)) {
      const match = ua.match(/(?:iPhone OS|iPad.*OS) ([\d_]+)/);
      result.os.name = 'iOS';
      result.os.version = match?.[1]?.replace(/_/g, '.') || '';
      result.isMobile = /iPhone/.test(ua);
      result.isTablet = /iPad/.test(ua);
    } else if (/Linux/.test(ua)) {
      result.os.name = 'Linux';
      result.isDesktop = true;
    }

    // Detect device
    if (/Mobile/.test(ua) || /iPhone/.test(ua) || /Android.*Mobile/.test(ua)) {
      result.device.type = 'Mobile';
      result.isMobile = true;
    } else if (/iPad|Tablet/.test(ua)) {
      result.device.type = 'Tablet';
      result.isTablet = true;
    } else if (/Windows|Mac|Linux/.test(ua) && !result.isMobile && !result.isTablet) {
      result.device.type = 'Desktop';
      result.isDesktop = true;
    }

    // Detect bot
    if (/bot|crawler|spider|crawling/i.test(ua)) {
      result.isBot = true;
    }

    return result;
  }, [input]);

  const handleSample = () => {
    setInput('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  };

  const handleMobileSample = () => {
    setInput('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">User Agent String</label>
          <div className="flex gap-2">
            <button onClick={handleMobileSample} className="text-xs text-gray-500 hover:text-gray-700">
              Mobile
            </button>
            <span className="text-gray-300">|</span>
            <button onClick={handleSample} className="text-sm text-blue-600 hover:text-blue-700">
              Desktop
            </button>
          </div>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="Paste user agent string here..."
          rows={3}
        />
      </div>

      <button
        onClick={handleClear}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
      >
        Clear
      </button>

      {parsedUA && (
        <div className="space-y-4">
          {/* Quick badges */}
          <div className="flex flex-wrap gap-2">
            {parsedUA.isMobile && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Mobile</span>
            )}
            {parsedUA.isTablet && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Tablet</span>
            )}
            {parsedUA.isDesktop && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Desktop</span>
            )}
            {parsedUA.isBot && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Bot</span>
            )}
          </div>

          {/* Details */}
          <div className="grid gap-4">
            {/* Browser */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Browser</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium">{parsedUA.browser.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 font-medium">{parsedUA.browser.version || '-'}</span>
                </div>
              </div>
            </div>

            {/* OS */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Operating System</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium">{parsedUA.os.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Version:</span>
                  <span className="ml-2 font-medium">{parsedUA.os.version || '-'}</span>
                </div>
              </div>
            </div>

            {/* Device */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Device</h4>
              <div className="text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="ml-2 font-medium">{parsedUA.device.type}</span>
              </div>
            </div>

            {/* Engine */}
            {parsedUA.engine.name && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Engine</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-medium">{parsedUA.engine.name}</span>
                  </div>
                  {parsedUA.engine.version && (
                    <div>
                      <span className="text-gray-500">Version:</span>
                      <span className="ml-2 font-medium">{parsedUA.engine.version}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* JSON Output */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">JSON Output</h4>
            <pre className="text-xs text-gray-100 overflow-x-auto">
              {JSON.stringify(parsedUA, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
