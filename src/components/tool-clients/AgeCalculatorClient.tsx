'use client';

import { useState } from 'react';

export default function AgeCalculatorClient() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    nextBirthday: { days: number; date: Date };
  } | null>(null);

  const calculate = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      setError('Birth date cannot be in the future');
      return;
    }

    // Calculate age
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      nextBirthday: { days: daysUntilBirthday, date: nextBirthday },
    });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculate}
        disabled={!birthDate}
        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Calculate Age
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Age */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-4xl font-bold text-blue-600">
              {result.years} years, {result.months} months, {result.days} days
            </p>
          </div>

          {/* Total Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{result.totalMonths.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Months</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{result.totalWeeks.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Weeks</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{result.totalDays.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Days</p>
            </div>
          </div>

          {/* Next Birthday */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              🎂 Next birthday in <strong>{result.nextBirthday.days} days</strong> (
              {result.nextBirthday.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })})
            </p>
          </div>

          {/* Fun Stats */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>• You've lived approximately <strong>{Math.floor(result.totalDays * 24 * 60).toLocaleString()}</strong> minutes</p>
            <p>• You've taken approximately <strong>{(result.totalDays * 22000).toLocaleString()}</strong> breaths</p>
            <p>• Your heart has beaten approximately <strong>{(result.totalDays * 24 * 60 * 72).toLocaleString()}</strong> times</p>
          </div>
        </div>
      )}
    </div>
  );
}
