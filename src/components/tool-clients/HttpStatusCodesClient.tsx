'use client';

import { useState } from 'react';

interface StatusCodeInfo {
  code: number;
  name: string;
  description: string;
  category: string;
}

const httpStatusCodes: StatusCodeInfo[] = [
  // 1xx - Informational
  { code: 100, name: 'Continue', description: 'Server received request headers and client should continue sending body', category: 'Informational' },
  { code: 101, name: 'Switching Protocols', description: 'Client requested to switch protocols and server agreed', category: 'Informational' },
  { code: 102, name: 'Processing', description: 'Server is processing the request but no response is available yet', category: 'Informational' },
  { code: 103, name: 'Early Hints', description: 'Server is likely to send a final response with the headers included', category: 'Informational' },

  // 2xx - Success
  { code: 200, name: 'OK', description: 'Request succeeded', category: 'Success' },
  { code: 201, name: 'Created', description: 'Request succeeded and a new resource was created', category: 'Success' },
  { code: 202, name: 'Accepted', description: 'Request accepted for processing but not yet complete', category: 'Success' },
  { code: 204, name: 'No Content', description: 'Request succeeded but no content to return', category: 'Success' },
  { code: 206, name: 'Partial Content', description: 'Server is delivering only part of the resource', category: 'Success' },

  // 3xx - Redirection
  { code: 300, name: 'Multiple Choices', description: 'Resource has multiple representations', category: 'Redirection' },
  { code: 301, name: 'Moved Permanently', description: 'Resource has been permanently moved to a new URL', category: 'Redirection' },
  { code: 302, name: 'Found', description: 'Resource temporarily at a different URL', category: 'Redirection' },
  { code: 304, name: 'Not Modified', description: 'Resource has not been modified since last request', category: 'Redirection' },
  { code: 307, name: 'Temporary Redirect', description: 'Resource temporarily at a different URL', category: 'Redirection' },
  { code: 308, name: 'Permanent Redirect', description: 'Resource permanently at a different URL', category: 'Redirection' },

  // 4xx - Client Error
  { code: 400, name: 'Bad Request', description: 'Server could not understand the request', category: 'Client Error' },
  { code: 401, name: 'Unauthorized', description: 'Authentication required for this resource', category: 'Client Error' },
  { code: 403, name: 'Forbidden', description: 'Server understands request but refuses to authorize', category: 'Client Error' },
  { code: 404, name: 'Not Found', description: 'Server cannot find the requested resource', category: 'Client Error' },
  { code: 405, name: 'Method Not Allowed', description: 'Request method not supported for this resource', category: 'Client Error' },
  { code: 408, name: 'Request Timeout', description: 'Server timed out waiting for request', category: 'Client Error' },
  { code: 409, name: 'Conflict', description: 'Request conflicts with current state of server', category: 'Client Error' },
  { code: 410, name: 'Gone', description: 'Resource no longer available at this URL', category: 'Client Error' },
  { code: 413, name: 'Payload Too Large', description: 'Request entity is larger than server limits', category: 'Client Error' },
  { code: 414, name: 'URI Too Long', description: 'URL requested is too long for server to process', category: 'Client Error' },
  { code: 415, name: 'Unsupported Media Type', description: 'Media type not supported by server', category: 'Client Error' },
  { code: 418, name: "I'm a teapot", description: 'Server refuses to brew coffee because it is a teapot', category: 'Client Error' },
  { code: 422, name: 'Unprocessable Entity', description: 'Server understands content but cannot process it', category: 'Client Error' },
  { code: 429, name: 'Too Many Requests', description: 'User has sent too many requests', category: 'Client Error' },

  // 5xx - Server Error
  { code: 500, name: 'Internal Server Error', description: 'Server encountered an unexpected condition', category: 'Server Error' },
  { code: 501, name: 'Not Implemented', description: 'Server does not support the functionality required', category: 'Server Error' },
  { code: 502, name: 'Bad Gateway', description: 'Server received invalid response from upstream server', category: 'Server Error' },
  { code: 503, name: 'Service Unavailable', description: 'Server is currently unavailable', category: 'Server Error' },
  { code: 504, name: 'Gateway Timeout', description: 'Server did not receive timely response from upstream', category: 'Server Error' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'HTTP version used in request not supported', category: 'Server Error' },
];

export default function HttpStatusCodesClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Informational', 'Success', 'Redirection', 'Client Error', 'Server Error'];

  const filteredCodes = httpStatusCodes.filter(code => {
    const matchesSearch = searchTerm === '' ||
      code.code.toString().includes(searchTerm) ||
      code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || code.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Informational': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Success': return 'bg-green-100 text-green-800 border-green-200';
      case 'Redirection': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Client Error': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Server Error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCodeColor = (code: number): string => {
    if (code >= 100 && code < 200) return 'text-blue-600 bg-blue-50';
    if (code >= 200 && code < 300) return 'text-green-600 bg-green-50';
    if (code >= 300 && code < 400) return 'text-yellow-600 bg-yellow-50';
    if (code >= 400 && code < 500) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by code, name, or description..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-500">
        Showing {filteredCodes.length} of {httpStatusCodes.length} codes
      </div>

      <div className="grid gap-3">
        {filteredCodes.map((code) => (
          <div
            key={code.code}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`text-2xl font-bold px-3 py-1 rounded ${getCodeColor(code.code)}`}>
                {code.code}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{code.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(code.category)}`}>
                    {code.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{code.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No status codes found matching your search.
        </div>
      )}
    </div>
  );
}
