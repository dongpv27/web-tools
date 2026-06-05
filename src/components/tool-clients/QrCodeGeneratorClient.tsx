'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';

type Preset = 'text' | 'url' | 'wifi' | 'vcard' | 'sms' | 'email' | 'phone' | 'geo' | 'event';

// Escape special characters in WiFi / vCard / similar QR payloads per their
// respective specs. WiFi payload uses `:` as field separator and `;` as
// terminator; both need backslash-escaping inside values.
const wifiEscape = (s: string): string => s.replace(/([\\;,":])/g, '\\$1');
const vcardEscape = (s: string): string => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');

export default function QrCodeGeneratorClient() {
  const [preset, setPreset] = useState<Preset>('text');

  // Generic content (used by 'text' and 'url' modes)
  const [text, setText] = useState('https://example.com');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard
  const [vcName, setVcName] = useState('');
  const [vcOrg, setVcOrg] = useState('');
  const [vcTitle, setVcTitle] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcUrl, setVcUrl] = useState('');

  // SMS / Email / Phone / Geo
  const [smsNumber, setSmsNumber] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [geoLat, setGeoLat] = useState('');
  const [geoLng, setGeoLng] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Visuals
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [margin, setMargin] = useState(2);

  // Logo
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [logoSizePct, setLogoSizePct] = useState(20);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [svgMarkup, setSvgMarkup] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Format ISO local datetime as VCALENDAR-compatible UTC. The <input
  // type="datetime-local"> gives "YYYY-MM-DDTHH:mm" with no timezone; we
  // treat it as local, convert to UTC, and emit "YYYYMMDDTHHmmssZ".
  const toIcsDate = (local: string): string => {
    if (!local) return '';
    const d = new Date(local);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  // Derive the final QR payload from the preset + its inputs.
  const payload = useMemo((): string => {
    switch (preset) {
      case 'text':
      case 'url':
        return text;
      case 'wifi':
        if (!wifiSsid) return '';
        if (wifiAuth === 'nopass') {
          return `WIFI:T:nopass;S:${wifiEscape(wifiSsid)};${wifiHidden ? 'H:true;' : ''};`;
        }
        return `WIFI:T:${wifiAuth};S:${wifiEscape(wifiSsid)};P:${wifiEscape(wifiPassword)};${wifiHidden ? 'H:true;' : ''};`;
      case 'vcard': {
        if (!vcName && !vcPhone && !vcEmail) return '';
        const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
        if (vcName) lines.push(`FN:${vcardEscape(vcName)}`);
        if (vcOrg) lines.push(`ORG:${vcardEscape(vcOrg)}`);
        if (vcTitle) lines.push(`TITLE:${vcardEscape(vcTitle)}`);
        if (vcPhone) lines.push(`TEL;TYPE=CELL:${vcardEscape(vcPhone)}`);
        if (vcEmail) lines.push(`EMAIL:${vcardEscape(vcEmail)}`);
        if (vcUrl) lines.push(`URL:${vcardEscape(vcUrl)}`);
        lines.push('END:VCARD');
        return lines.join('\n');
      }
      case 'sms':
        if (!smsNumber) return '';
        return `SMSTO:${smsNumber}:${smsBody}`;
      case 'email': {
        if (!emailTo) return '';
        const params = new URLSearchParams();
        if (emailSubject) params.set('subject', emailSubject);
        if (emailBody) params.set('body', emailBody);
        const q = params.toString();
        return `mailto:${emailTo}${q ? '?' + q : ''}`;
      }
      case 'phone':
        return phoneNumber ? `tel:${phoneNumber}` : '';
      case 'geo':
        if (!geoLat || !geoLng) return '';
        return `geo:${geoLat},${geoLng}`;
      case 'event': {
        if (!eventTitle || !eventStart) return '';
        const lines = ['BEGIN:VEVENT', `SUMMARY:${vcardEscape(eventTitle)}`, `DTSTART:${toIcsDate(eventStart)}`];
        if (eventEnd) lines.push(`DTEND:${toIcsDate(eventEnd)}`);
        if (eventLocation) lines.push(`LOCATION:${vcardEscape(eventLocation)}`);
        lines.push('END:VEVENT');
        return lines.join('\n');
      }
    }
  }, [preset, text, wifiSsid, wifiPassword, wifiAuth, wifiHidden, vcName, vcOrg, vcTitle, vcPhone, vcEmail, vcUrl, smsNumber, smsBody, emailTo, emailSubject, emailBody, phoneNumber, geoLat, geoLng, eventTitle, eventStart, eventEnd, eventLocation]);

  // Re-render canvas + regenerate SVG whenever payload or visuals change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!payload) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setError('');
      setSvgMarkup('');
      return;
    }

    const opts = {
      width: size,
      errorCorrectionLevel: errorLevel,
      margin,
      color: { dark: darkColor, light: lightColor },
    } as const;

    QRCode.toCanvas(canvas, payload, opts)
      .then(() => {
        setError('');
        // Overlay the logo if one was uploaded — needs error correction H
        // because we're punching out ~20% of the modules.
        if (logoDataUrl) {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const img = new Image();
          img.onload = () => {
            const logoPx = Math.round(canvas.width * (logoSizePct / 100));
            const x = (canvas.width - logoPx) / 2;
            const y = (canvas.height - logoPx) / 2;
            // White-pad behind the logo so it never clips a finder module.
            const pad = Math.max(4, Math.round(logoPx * 0.08));
            ctx.fillStyle = lightColor;
            ctx.fillRect(x - pad, y - pad, logoPx + pad * 2, logoPx + pad * 2);
            ctx.drawImage(img, x, y, logoPx, logoPx);
          };
          img.src = logoDataUrl;
        }
      })
      .catch((e: Error) => setError(e.message));

    QRCode.toString(payload, { ...opts, type: 'svg' })
      .then((svg) => setSvgMarkup(svg))
      .catch(() => setSvgMarkup(''));
  }, [payload, size, errorLevel, darkColor, lightColor, margin, logoDataUrl, logoSizePct]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
    // Force high error correction when a logo is added.
    setErrorLevel('H');
  };

  const PRESETS: { value: Preset; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'url', label: 'URL' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'vcard', label: 'Contact (vCard)' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'geo', label: 'Location (geo)' },
    { value: 'event', label: 'Calendar event' },
  ];

  return (
    <div className="space-y-6">
      {/* Preset selector — dropdown on mobile (compact), button grid on sm+ (faster to scan) */}
      <div>
        <label htmlFor="qr-preset" className="block text-sm font-medium text-gray-700 mb-2">Content type</label>
        <select
          id="qr-preset"
          value={preset}
          onChange={(e) => setPreset(e.target.value as Preset)}
          className="sm:hidden w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <div className="hidden sm:flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPreset(p.value)}
              className={`px-3 py-2 text-sm rounded-md transition-colors min-h-[40px] ${
                preset === p.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset-specific inputs */}
      {(preset === 'text' || preset === 'url') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{preset === 'url' ? 'URL' : 'Text content'}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
            placeholder={preset === 'url' ? 'https://example.com' : 'Any text…'}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        </div>
      )}

      {preset === 'wifi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network name (SSID)</label>
            <input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="MyHomeWiFi"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
            <select value={wifiAuth} onChange={(e) => setWifiAuth(e.target.value as 'WPA' | 'WEP' | 'nopass')}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white">
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP (legacy)</option>
              <option value="nopass">Open (no password)</option>
            </select>
          </div>
          {wifiAuth !== 'nopass' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md font-mono" />
            </div>
          )}
          <label className="flex items-center gap-2 sm:col-span-2 text-sm text-gray-700">
            <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            Hidden network (SSID broadcast disabled)
          </label>
        </div>
      )}

      {preset === 'vcard' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input value={vcName} onChange={(e) => setVcName(e.target.value)} placeholder="Nguyen Van A" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={vcPhone} onChange={(e) => setVcPhone(e.target.value)} placeholder="+84 90 123 4567" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={vcEmail} onChange={(e) => setVcEmail(e.target.value)} placeholder="name@example.com" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <input value={vcOrg} onChange={(e) => setVcOrg(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
            <input value={vcTitle} onChange={(e) => setVcTitle(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input value={vcUrl} onChange={(e) => setVcUrl(e.target.value)} placeholder="https://" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
        </div>
      )}

      {preset === 'sms' && (
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input value={smsNumber} onChange={(e) => setSmsNumber(e.target.value)} placeholder="+84..." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
            <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
        </div>
      )}

      {preset === 'email' && (
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
            <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body (optional)</label>
            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={3} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
        </div>
      )}

      {preset === 'phone' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+84..." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
        </div>
      )}

      {preset === 'geo' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input value={geoLat} onChange={(e) => setGeoLat(e.target.value)} placeholder="21.0285" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input value={geoLng} onChange={(e) => setGeoLng(e.target.value)} placeholder="105.8542" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md font-mono" />
          </div>
        </div>
      )}

      {preset === 'event' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Event title</label>
            <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End (optional)</label>
            <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
            <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md" />
          </div>
        </div>
      )}

      {/* Visual options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Size (px)</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md">
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={1024}>1024</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Error correction {logoDataUrl && <span className="text-xs text-amber-600">(forced H for logo)</span>}</label>
          <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as typeof errorLevel)}
            disabled={!!logoDataUrl}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md disabled:bg-gray-100">
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Foreground</label>
          <div className="flex items-center gap-2">
            <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
              className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0" aria-label="Foreground" />
            <input type="text" value={darkColor} onChange={(e) => setDarkColor(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 text-sm font-mono border border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)}
              className="w-10 h-9 border border-gray-300 rounded cursor-pointer p-0" aria-label="Background" />
            <input type="text" value={lightColor} onChange={(e) => setLightColor(e.target.value)}
              className="flex-1 min-w-0 px-2 py-2 text-sm font-mono border border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Margin (modules)</label>
          <input type="number" min={0} max={10} value={margin}
            onChange={(e) => setMargin(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md" />
        </div>
      </div>

      {/* Logo embed */}
      <div className="p-3 bg-gray-50 rounded-lg space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Center logo (optional):</label>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
          {!logoDataUrl ? (
            <button onClick={() => logoInputRef.current?.click()}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100">
              Upload logo
            </button>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoDataUrl} alt="logo" className="w-8 h-8 object-contain border border-gray-200 rounded" />
              <button onClick={() => setLogoDataUrl('')} className="text-sm text-red-600 hover:text-red-700">Remove</button>
            </>
          )}
        </div>
        {logoDataUrl && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Logo size: {logoSizePct}% of QR</label>
            <input type="range" min="10" max="30" value={logoSizePct}
              onChange={(e) => setLogoSizePct(Number(e.target.value))} className="w-full" />
            <p className="text-xs text-gray-500 mt-1">Keep under 25% to remain reliably scannable. Error correction forced to H (30%).</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={downloadPng} disabled={!payload || !!error}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
          Download PNG
        </button>
        <button onClick={downloadSvg} disabled={!payload || !!error || !svgMarkup || !!logoDataUrl}
          title={logoDataUrl ? 'SVG export not available with logo overlay (PNG only)' : ''}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          Download SVG
        </button>
      </div>
    </div>
  );
}
