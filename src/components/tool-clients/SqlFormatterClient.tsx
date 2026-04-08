'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

// ─── Keyword lists ────────────────────────────────────────────────────────────

const MAJOR_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'SET',
  'HAVING', 'LIMIT', 'OFFSET',
  'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
  'INSERT INTO', 'VALUES', 'UPDATE', 'DELETE FROM',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
  'ORDER BY', 'GROUP BY',
  'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN',
  'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
  'JOIN', 'ON', 'INTO',
];

const SUB_KEYWORDS = ['AND', 'OR', 'WHEN', 'THEN', 'ELSE', 'END'];

const ALL_KEYWORDS = [
  ...MAJOR_KEYWORDS, ...SUB_KEYWORDS,
  'AS', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE',
  'IS NULL', 'IS NOT NULL', 'NULL', 'NOT NULL',
  'ASC', 'DESC', 'DISTINCT', 'ALL', 'TOP',
  'CASE', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES',
  'DEFAULT', 'AUTO_INCREMENT', 'UNIQUE', 'CHECK',
  'CONSTRAINT', 'INDEX', 'TEMPORARY',
  'NULLS FIRST', 'NULLS LAST',
  'WITH', 'RECURSIVE',
  'INNER', 'OUTER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'NATURAL',
];

function buildKeywordRegex(): RegExp {
  const sorted = [...ALL_KEYWORDS].sort((a, b) => b.length - a.length);
  const pattern = sorted.map(k => k.replace(/\s+/g, '\\s+')).join('|');
  return new RegExp(`\\b(${pattern})\\b`, 'gi');
}

const KEYWORD_REGEX = buildKeywordRegex();

// ─── SQL highlighter (React nodes) ────────────────────────────────────────────

function highlightSqlNodes(sql: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const combined = new RegExp(
    `(${KEYWORD_REGEX.source})|('(?:[^'\\\\]|\\\\.)*')|("(?:[^"\\\\]|\\\\.)*")`,
    'gi'
  );
  let match;
  while ((match = combined.exec(sql)) !== null) {
    if (match.index > lastIndex) parts.push(sql.slice(lastIndex, match.index));
    if (match[1]) {
      parts.push(<span key={match.index} className="text-blue-600 font-semibold">{match[0]}</span>);
    } else if (match[2] || match[3]) {
      parts.push(<span key={match.index} className="text-green-600">{match[0]}</span>);
    }
    lastIndex = combined.lastIndex;
  }
  if (lastIndex < sql.length) parts.push(sql.slice(lastIndex));
  return parts;
}

// ─── HTML highlighter (string) ────────────────────────────────────────────────

function highlightHtmlSpan(sql: string): string {
  return sql.replace(
    new RegExp(`(${KEYWORD_REGEX.source})|('(?:[^'\\\\]|\\\\.)*')|("(?:[^"\\\\]|\\\\.)*")`, 'gi'),
    (m, kw, sq, dq) => {
      if (kw) return `<span style="color:#2563eb;font-weight:600">${escHtml(kw)}</span>`;
      if (sq || dq) return `<span style="color:#16a34a">${escHtml(m)}</span>`;
      return escHtml(m);
    }
  );
}

function highlightHtmlFont(sql: string): string {
  return sql.replace(
    new RegExp(`(${KEYWORD_REGEX.source})|('(?:[^'\\\\]|\\\\.)*')|("(?:[^"\\\\]|\\\\.)*")`, 'gi'),
    (m, kw, sq, dq) => {
      if (kw) return `<font color="#2563eb"><b>${escHtml(kw)}</b></font>`;
      if (sq || dq) return `<font color="#16a34a">${escHtml(m)}</font>`;
      return escHtml(m);
    }
  );
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Output converters ────────────────────────────────────────────────────────

type OutputFormat =
  | 'html' | 'html2' | 'SQL'
  | 'htmlkeeplayout' | 'htmlkeeplayout2'
  | 'htmlkeeplayoutmodifycase' | 'htmlkeeplayout2modifycase'
  | 'txtmodifycase'
  | 'C#' | 'C# String Builder' | 'Delphi'
  | 'Java' | 'Java String Buffer'
  | 'PHP' | 'VB' | 'VBSBD' | 'VC'
  | 'dbobject' | 'proc' | 'procobol' | 'xml';

const OUTPUT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'html', label: 'SQL (html:span)' },
  { value: 'html2', label: 'SQL (html:font)' },
  { value: 'SQL', label: 'SQL (Text)' },
  { value: 'htmlkeeplayout', label: 'SQL (html:span, keep layout)' },
  { value: 'htmlkeeplayout2', label: 'SQL (html:font, keep layout)' },
  { value: 'htmlkeeplayoutmodifycase', label: 'SQL (html:span, keep layout, modify case)' },
  { value: 'htmlkeeplayout2modifycase', label: 'SQL (html:font, keep layout, modify case)' },
  { value: 'txtmodifycase', label: 'SQL (Text, keep layout, change case only)' },
  { value: 'C#', label: 'C#' },
  { value: 'C# String Builder', label: 'C# String Builder' },
  { value: 'Delphi', label: 'Delphi' },
  { value: 'Java', label: 'Java' },
  { value: 'Java String Buffer', label: 'Java String Buffer' },
  { value: 'PHP', label: 'PHP' },
  { value: 'VB', label: 'VB' },
  { value: 'VBSBD', label: 'VB String Builder' },
  { value: 'VC', label: 'VC' },
  { value: 'dbobject', label: 'List DB Object' },
  { value: 'proc', label: 'Pro*C' },
  { value: 'procobol', label: 'Pro*Cobol' },
  { value: 'xml', label: 'XML output' },
];

function keywordToUpper(line: string): string {
  return line.replace(KEYWORD_REGEX, m => m.toUpperCase());
}

function escCs(s: string): string { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }
function escVb(s: string): string { return s.replace(/"/g, '""'); }
function escDelphi(s: string): string { return s.replace(/'/g, "''"); }

function convertOutput(formatted: string, input: string, fmt: OutputFormat): string {
  const lines = formatted.split('\n');

  switch (fmt) {
    // ── plain SQL text ──
    case 'SQL':
      return formatted;

    case 'txtmodifycase':
      return lines.map(keywordToUpper).join('\n');

    // ── HTML span ──
    case 'html':
      return lines.map(l => highlightHtmlSpan(escHtml(l))).join('\n');

    case 'htmlkeeplayout':
      return input.split('\n').map(l => highlightHtmlSpan(escHtml(l))).join('\n');

    case 'htmlkeeplayoutmodifycase':
      return input.split('\n').map(l => highlightHtmlSpan(escHtml(keywordToUpper(l)))).join('\n');

    // ── HTML font ──
    case 'html2':
      return lines.map(l => highlightHtmlFont(escHtml(l))).join('\n');

    case 'htmlkeeplayout2':
      return input.split('\n').map(l => highlightHtmlFont(escHtml(l))).join('\n');

    case 'htmlkeeplayout2modifycase':
      return input.split('\n').map(l => highlightHtmlFont(escHtml(keywordToUpper(l)))).join('\n');

    // ── C# ──
    case 'C#': {
      let out = 'String varname1 = "";\n';
      lines.forEach(l => {
        out += `varname1 = varname1 + "${escCs(l)}";\n`;
      });
      return out.trimEnd();
    }

    case 'C# String Builder': {
      let out = 'StringBuilder varname1 = new StringBuilder();\n';
      lines.forEach(l => {
        out += `varname1.AppendLine("${escCs(l)}");\n`;
      });
      return out.trimEnd();
    }

    // ── Java ──
    case 'Java': {
      let out = 'String varname1 = "";\n';
      lines.forEach(l => {
        out += `varname1 = varname1 + "${escCs(l)}";\n`;
      });
      return out.trimEnd();
    }

    case 'Java String Buffer': {
      let out = 'StringBuffer varname1 = new StringBuffer();\n';
      lines.forEach(l => {
        out += `varname1.append("${escCs(l)}");\n`;
      });
      return out.trimEnd();
    }

    // ── PHP ──
    case 'PHP': {
      let out = '$varname1 = "";\n';
      lines.forEach(l => {
        out += `$varname1 .= "${escCs(l)}" . "\\n";\n`;
      });
      return out.trimEnd();
    }

    // ── VB ──
    case 'VB': {
      let out = 'Dim varname1 As String\nvarname1 = ""\n';
      lines.forEach(l => {
        out += `varname1 = varname1 & "${escVb(l)}" & vbCrLf\n`;
      });
      return out.trimEnd();
    }

    // ── VB String Builder ──
    case 'VBSBD': {
      let out = 'Dim varname1 As New StringBuilder()\n';
      lines.forEach(l => {
        out += `varname1.AppendLine("${escVb(l)}")\n`;
      });
      return out.trimEnd();
    }

    // ── Delphi ──
    case 'Delphi': {
      let out = 'varname1 := \'\';\n';
      lines.forEach(l => {
        out += `varname1 := varname1 + '${escDelphi(l)}' + #13#10;\n`;
      });
      return out.trimEnd();
    }

    // ── VC ──
    case 'VC': {
      let out = 'CString varname1 = _T("");\n';
      lines.forEach(l => {
        out += `varname1 = varname1 + _T("${escCs(l)}") + _T("\\n");\n`;
      });
      return out.trimEnd();
    }

    // ── Pro*C ──
    case 'proc': {
      let out = 'char *varname1 = "";\n';
      lines.forEach(l => {
        out += `varname1 = varname1 + "${escCs(l)}" "\\n"\n`;
      });
      return out.trimEnd();
    }

    // ── Pro*Cobol ──
    case 'procobol': {
      let out = '01 varname1 PIC X(32768).\n';
      lines.forEach(l => {
        out += `   STRING "${escCs(l)}" DELIMITED BY SIZE\n`;
        out += `          INTO varname1\n`;
      });
      return out.trimEnd();
    }

    // ── List DB Objects ──
    case 'dbobject': {
      const objRegex = /\b(FROM|JOIN|INTO|UPDATE|TABLE)\s+(\w+)/gi;
      const objects = new Set<string>();
      let m;
      while ((m = objRegex.exec(input)) !== null) objects.add(m[2]);
      return [...objects].join('\n');
    }

    // ── XML ──
    case 'xml': {
      const xmlLines = lines.map(l => `  <line><![CDATA[${l}]]></line>`).join('\n');
      return `<?xml version="1.0" encoding="UTF-8"?>\n<sql>\n${xmlLines}\n</sql>`;
    }

    default:
      return formatted;
  }
}

// ─── Select class helper ──────────────────────────────────────────────────────

const selectClass =
  "appearance-none px-3 py-1.5 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.375rem_center] bg-no-repeat";

// ─── Component ────────────────────────────────────────────────────────────────

export default function SqlFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState<number | string>(2);
  const [database, setDatabase] = useState('Generic');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('SQL');

  // ── Format SQL ──
  const formatSql = (sql: string, indentValue: number | string): string => {
    const indentStr = indentValue === 'tab' ? '\t' : ' '.repeat(indentValue as number);

    sql = sql.replace(/\s+/g, ' ').trim();

    const majorSorted = [...MAJOR_KEYWORDS].sort((a, b) => b.length - a.length);
    const majorPattern = majorSorted.map(k => k.replace(/\s+/g, '\\s+')).join('|');
    const majorRegex = new RegExp(`\\b(${majorPattern})\\b`, 'gi');

    const subSorted = [...SUB_KEYWORDS].sort((a, b) => b.length - a.length);
    const subPattern = subSorted.map(k => k.replace(/\s+/g, '\\s+')).join('|');
    const subRegex = new RegExp(`\\b(${subPattern})\\b`, 'gi');

    sql = sql.replace(majorRegex, '\n$&');
    sql = sql.replace(subRegex, '\n' + indentStr + '$&');
    sql = sql.replace(/\(/g, ' (\n');
    sql = sql.replace(/\)/g, '\n)');

    // Split SELECT columns
    const lines = sql.split('\n');
    const result: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/^SELECT\b/i.test(trimmed) && !/^SELECT\s+\*/i.test(trimmed)) {
        const afterSelect = trimmed.replace(/^SELECT\s*/i, '');
        const columns = afterSelect.split(',').map((c: string) => c.trim());
        const padding = indentStr + ' '.repeat('SELECT '.length);
        result.push('SELECT ' + columns[0]);
        for (let i = 1; i < columns.length; i++) {
          result.push(padding + ', ' + columns[i]);
        }
      } else {
        result.push(trimmed);
      }
    }

    // Re-indent
    const formatted: string[] = [];
    let level = 0;
    for (const line of result) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith(')')) level = Math.max(0, level - 1);
      const isSub = subRegex.test(trimmed);
      formatted.push(indentStr.repeat(level) + (isSub ? indentStr : '') + trimmed);
      if (trimmed.includes('(') && !trimmed.includes(')')) level++;
      subRegex.lastIndex = 0;
    }

    return formatted.join('\n').trim();
  };

  // ── Highlighted JSX output (only for plain SQL formats) ──
  const CODE_FORMATS: OutputFormat[] = [
    'C#', 'C# String Builder', 'Java', 'Java String Buffer',
    'PHP', 'VB', 'VBSBD', 'Delphi', 'VC', 'proc', 'procobol', 'dbobject',
  ];
  const HTML_FORMATS: OutputFormat[] = [
    'html', 'html2', 'htmlkeeplayout', 'htmlkeeplayout2',
    'htmlkeeplayoutmodifycase', 'htmlkeeplayout2modifycase',
  ];

  const isHtmlRenderable = HTML_FORMATS.includes(outputFormat);
  const isCodeOutput = CODE_FORMATS.includes(outputFormat) || outputFormat === 'xml';

  const highlightedOutput = useMemo(() => {
    if (!output || isHtmlRenderable || isCodeOutput) return null;
    return output.split('\n').map((line, i) => (
      <div key={i}>{highlightSqlNodes(line)}</div>
    ));
  }, [output, outputFormat, isHtmlRenderable, isCodeOutput]);

  const format = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter SQL to format');
      return;
    }
    try {
      const formatted = formatSql(input, indent);
      setOutput(convertOutput(formatted, input, outputFormat));
    } catch (e) {
      setError(`Error formatting SQL: ${(e as Error).message}`);
    }
  };

  const minify = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter SQL to minify');
      return;
    }
    try {
      const minified = input
        .replace(/--.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .trim();
      setOutput(convertOutput(minified, input, outputFormat));
    } catch (e) {
      setError(`Error minifying SQL: ${(e as Error).message}`);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    setInput("SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.created_at > '2024-01-01' ORDER BY o.total DESC LIMIT 10");
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">SQL Input</label>
          <button onClick={loadSample} className="text-sm text-blue-600 hover:text-blue-700">
            Load Sample
          </button>
        </div>
        <ToolInput
          value={input}
          onChange={setInput}
          placeholder="SELECT * FROM table..."
          rows={6}
        lineNumbers
        />
      </div>

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Database */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Database:</label>
          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            className={selectClass}
          >
            {['MS Access', 'DB2', 'MSSQL', 'MySQL', 'Oracle/PLSQL', 'MDX', 'Generic'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Output Format */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Output:</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className={selectClass}
          >
            {OUTPUT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Indent */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value === 'tab' ? 'tab' : Number(e.target.value))}
            className={selectClass}
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} space{n > 1 ? 's' : ''}</option>
            ))}
            <option value="tab">Tab</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Minify
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Output */}
      {output && !error && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Formatted SQL</label>
            <div className="flex gap-2">
              <CopyButton text={output} />
              <DownloadButton
                content={output}
                filename={outputFormat === 'xml' ? 'formatted.xml' : 'formatted.sql'}
              />
            </div>
          </div>
          <div className="relative">
            {isHtmlRenderable ? (
              <pre
                className="w-full px-4 py-3 text-sm font-mono bg-white border border-gray-200 text-gray-800 rounded-lg overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            ) : (
              <pre className="w-full px-4 py-3 text-sm font-mono bg-white border border-gray-200 text-gray-800 rounded-lg overflow-x-auto">
                <code>{highlightedOutput ?? output}</code>
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {input && output && (
        <div className="text-sm text-gray-500">
          Input: {input.length} chars → Output: {output.length} chars
        </div>
      )}
    </div>
  );
}
