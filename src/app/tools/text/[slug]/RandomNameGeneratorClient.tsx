'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

const firstNamesMale = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul',
  'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald',
  'Edward', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric',
];

const firstNamesFemale = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica',
  'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley',
  'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda', 'Melissa',
  'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

export default function RandomNameGeneratorClient() {
  const [names, setNames] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [gender, setGender] = useState<'both' | 'male' | 'female'>('both');
  const [includeLastName, setIncludeLastName] = useState(true);

  const generate = () => {
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      let firstName: string;
      let firstNamePool: string[];

      if (gender === 'male') {
        firstNamePool = firstNamesMale;
      } else if (gender === 'female') {
        firstNamePool = firstNamesFemale;
      } else {
        firstNamePool = Math.random() > 0.5 ? firstNamesMale : firstNamesFemale;
      }

      firstName = firstNamePool[Math.floor(Math.random() * firstNamePool.length)];

      if (includeLastName) {
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        result.push(`${firstName} ${lastName}`);
      } else {
        result.push(firstName);
      }
    }

    setNames(result);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(names.join('\n'));
  };

  const clearAll = () => {
    setNames([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
          <input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="both">Both</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={includeLastName}
              onChange={(e) => setIncludeLastName(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Include last name</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Names
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {names.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Generated Names ({names.length})
            </label>
            <button
              onClick={copyAll}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Copy All
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
            {names.map((name, i) => (
              <div key={i} className="flex items-center justify-between p-3 group">
                <span className="text-sm">{name}</span>
                <CopyButton text={name} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
