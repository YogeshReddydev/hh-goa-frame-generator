import React, { useEffect, useState, useRef } from 'react';
import { Download, Twitter, Edit2, RotateCcw, Check, Sparkles, AlertCircle, QrCode, Contact, Globe, Copy, Github, Link as LinkIcon, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeCanvas } from 'qrcode.react';
import { BuilderData } from '../types';

interface ResultScreenProps {
  generatedDataUrl: string | null;
  onEdit: () => void;
  onCreateAnother: () => void;
  builderName?: string;
  builderData?: BuilderData;
  isPfp: boolean;
}

type QrType = 'VCARD' | 'TWITTER' | 'GITHUB' | 'CUSTOM';

export const ResultScreen: React.FC<ResultScreenProps> = ({
  generatedDataUrl,
  onEdit,
  onCreateAnother,
  builderName = 'builder',
  builderData,
  isPfp,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);

  // QR Code State
  const [qrType, setQrType] = useState<QrType>('VCARD');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [githubUser, setGithubUser] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [copiedQr, setCopiedQr] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  // Trigger confetti burst on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD600', '#FF007A', '#006B3C', '#FFF9E8'],
      });
    } catch {
      // Fallback
    }
  }, []);

  const filename = isPfp
    ? 'hh-goa-frame.png'
    : `hh-goa-builder-${builderName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;

  const handleDownload = () => {
    if (!generatedDataUrl) return;

    const link = document.createElement('a');
    link.href = generatedDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const handleShareToX = () => {
    // 1. Auto download image first if needed
    if (generatedDataUrl && !downloaded) {
      handleDownload();
    }

    // 2. Open X Tweet Composer intent
    const tweetText = encodeURIComponent(
      `I’m building in Goa with Hacker House Goa 2026 🌴💻\n\nMeet me at #FrameInGoa\n\nHACKER HOUSE GOA\n28–31 OCT 2026`
    );
    const xUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(xUrl, '_blank');

    setShowShareGuide(true);
  };

  // Generate QR Value string
  const getQrValue = (): string => {
    const name = builderData?.name || builderName || 'Builder';
    const role = builderData?.role || '';
    const city = builderData?.city || 'Goa, India';
    const title = builderData?.builderTitle || '';
    const building = builderData?.buildingText || '';

    if (qrType === 'TWITTER') {
      const cleanHandle = twitterHandle.trim().replace(/^@/, '');
      return cleanHandle ? `https://x.com/${cleanHandle}` : `https://x.com/search?q=%23FrameInGoa`;
    }

    if (qrType === 'GITHUB') {
      const cleanUser = githubUser.trim().replace(/^@/, '');
      return cleanUser ? `https://github.com/${cleanUser}` : `https://github.com`;
    }

    if (qrType === 'CUSTOM') {
      const trimmed = customUrl.trim();
      if (!trimmed) return 'https://hackerhousegoa.com';
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    }

    // Default VCARD
    const note = `Hacker House Goa 2026 Builder ID | ${title || 'Participant'} ${building ? `| Building: ${building}` : ''}`;
    const cleanTwitter = twitterHandle.trim().replace(/^@/, '');
    const cleanGithub = githubUser.trim().replace(/^@/, '');
    const url = customUrl.trim() || (cleanTwitter ? `https://x.com/${cleanTwitter}` : (cleanGithub ? `https://github.com/${cleanGithub}` : 'https://hackerhousegoa.com'));

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${name}`,
      `N:;${name};;;`,
      role ? `TITLE:${role}` : '',
      city ? `ADR:;;${city};;;;` : '',
      url ? `URL:${url}` : '',
      `NOTE:${note}`,
      'END:VCARD',
    ].filter(Boolean).join('\n');

    return vcard;
  };

  const qrValue = getQrValue();

  const handleCopyQrContent = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopiedQr(true);
      setTimeout(() => setCopiedQr(false), 3000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `hh-goa-qr-${builderName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-center">
      {/* Title Header */}
      <div className="inline-flex items-center gap-2 bg-[#FFD600] text-[#111111] font-mono-custom text-xs font-bold px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2 uppercase">
        <Sparkles className="w-4 h-4 text-[#FF007A]" />
        <span>PASSPORT READY</span>
      </div>

      <h2 className="font-display text-4xl sm:text-6xl text-[#FFF9E8] drop-shadow-[4px_4px_0px_#111111] mb-2">
        YOUR GOA ID IS READY!
      </h2>

      <p className="font-mono-custom text-xs sm:text-sm text-[#FFD600] mb-6">
        Download your high-res graphic & share your connect QR code
      </p>

      {/* Main Preview Container */}
      {generatedDataUrl ? (
        <div className="relative inline-block mb-8 animate-card-pop-in">
          <div className="bg-[#FFF9E8] p-3 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] transform -rotate-1 max-w-lg mx-auto overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <img
              src={generatedDataUrl}
              alt="Hacker House Goa Result"
              className="w-full h-auto rounded-lg border-2 border-[#111111] shadow-inner"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 sm:right-4 bg-[#FF007A] text-white font-display text-base px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transform rotate-3">
            OFFICIAL HH GOA 2026
          </div>
        </div>
      ) : (
        <div className="p-12 bg-[#FFF9E8] text-[#111111] font-mono-custom text-sm font-bold border-4 border-[#111111] rounded-2xl mb-8">
          GENERATING HIGH-RES PNG...
        </div>
      )}

      {/* Share Guide Banner Notice */}
      {showShareGuide && (
        <div className="max-w-lg mx-auto bg-[#FFD600] text-[#111111] p-4 border-3 border-[#111111] shadow-[4px_4px_0px_#111111] mb-6 text-left flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-[#FF007A] flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono-custom">
            <p className="font-bold text-sm mb-0.5">IMAGE SAVED TO DOWNLOADS! 📸</p>
            <p>
              Your graphic is saved in your browser downloads. Simply attach it to your post on X to share!
            </p>
          </div>
        </div>
      )}

      {/* Large Action Buttons */}
      <div className="max-w-lg mx-auto flex flex-col gap-3 mb-8">
        <button
          onClick={handleDownload}
          className="btn-goa-yellow w-full py-4 text-xl sm:text-2xl font-display flex items-center justify-center gap-3 cursor-pointer"
        >
          {downloaded ? (
            <>
              <Check className="w-6 h-6 text-[#006B3C]" />
              <span>DOWNLOADED PNG!</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>DOWNLOAD IMAGE (PNG) →</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareToX}
          className="btn-goa-pink w-full py-4 text-xl sm:text-2xl font-display flex items-center justify-center gap-3 cursor-pointer"
        >
          <Twitter className="w-6 h-6 fill-current" />
          <span>SHARE TO X (#FrameInGoa) →</span>
        </button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onEdit}
            className="btn-goa-cream py-3 text-base font-display flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-[#FF007A]" />
            <span>EDIT DETAILS</span>
          </button>

          <button
            onClick={onCreateAnother}
            className="btn-goa-cream py-3 text-base font-display flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#006B3C]" />
            <span>CREATE ANOTHER</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC BUILDER CONNECT QR CODE SECTION */}
      <div className="max-w-lg mx-auto bg-[#FFF9E8] p-5 sm:p-6 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] text-left mb-8">
        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FFD600] rounded-lg border-2 border-black">
              <QrCode className="w-5 h-5 text-[#111111]" />
            </div>
            <div>
              <h3 className="font-bebas text-2xl text-[#111111] leading-none">
                BUILDER CONNECT QR CODE
              </h3>
              <p className="font-mono-custom text-[11px] text-[#006B3C] font-bold">
                ALLOW OTHERS TO SCAN & CONNECT IN GOA
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block font-mono-custom text-[10px] font-bold bg-[#FF007A] text-white px-2 py-1 rounded border border-black uppercase">
            DYNAMIC
          </span>
        </div>

        {/* QR Code Type Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mb-4 bg-yellow-100/80 p-1.5 rounded-xl border-2 border-black">
          <button
            type="button"
            onClick={() => setQrType('VCARD')}
            className={`py-1.5 px-2 rounded-lg font-mono-custom text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              qrType === 'VCARD'
                ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#FFD600]'
                : 'text-[#111111] hover:bg-yellow-200'
            }`}
          >
            <Contact className="w-3.5 h-3.5 text-[#FFD600]" />
            <span>vCard</span>
          </button>

          <button
            type="button"
            onClick={() => setQrType('TWITTER')}
            className={`py-1.5 px-2 rounded-lg font-mono-custom text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              qrType === 'TWITTER'
                ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#FFD600]'
                : 'text-[#111111] hover:bg-yellow-200'
            }`}
          >
            <Twitter className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>X / Twitter</span>
          </button>

          <button
            type="button"
            onClick={() => setQrType('GITHUB')}
            className={`py-1.5 px-2 rounded-lg font-mono-custom text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              qrType === 'GITHUB'
                ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#FFD600]'
                : 'text-[#111111] hover:bg-yellow-200'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => setQrType('CUSTOM')}
            className={`py-1.5 px-2 rounded-lg font-mono-custom text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              qrType === 'CUSTOM'
                ? 'bg-[#111111] text-white shadow-[2px_2px_0px_#FFD600]'
                : 'text-[#111111] hover:bg-yellow-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>Link</span>
          </button>
        </div>

        {/* Inputs for Handle/URL */}
        <div className="mb-4">
          {qrType === 'TWITTER' && (
            <div>
              <label className="block font-mono-custom text-[11px] font-bold text-[#111111] mb-1">
                TWITTER / X HANDLE
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono-custom text-sm font-bold text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  placeholder="builder_goa"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border-2 border-black rounded-xl font-mono-custom text-xs text-[#111111] focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrType === 'GITHUB' && (
            <div>
              <label className="block font-mono-custom text-[11px] font-bold text-[#111111] mb-1">
                GITHUB USERNAME
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono-custom text-sm font-bold text-gray-500">
                  github.com/
                </span>
                <input
                  type="text"
                  placeholder="octocat"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full pl-28 pr-3 py-2 bg-white border-2 border-black rounded-xl font-mono-custom text-xs text-[#111111] focus:bg-yellow-50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {qrType === 'CUSTOM' && (
            <div>
              <label className="block font-mono-custom text-[11px] font-bold text-[#111111] mb-1">
                PORTFOLIO / PROFILE WEBSITE URL
              </label>
              <input
                type="url"
                placeholder="https://myportfolio.dev"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-black rounded-xl font-mono-custom text-xs text-[#111111] focus:bg-yellow-50 focus:outline-none"
              />
            </div>
          )}

          {qrType === 'VCARD' && (
            <div className="bg-white p-2.5 border-2 border-black rounded-xl text-[11px] font-mono-custom text-[#111111] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold border-b border-gray-200 pb-1">
                <span className="text-[#006B3C] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#FF007A]" /> {builderData?.name || builderName}
                </span>
                <span className="bg-[#FFD600] px-1.5 py-0.5 rounded border border-black text-[9px]">
                  {builderData?.role || 'BUILDER'}
                </span>
              </div>
              <p className="text-gray-600 truncate">
                📍 {builderData?.city || 'Goa, India'} • {builderData?.builderTitle || 'Participant'}
              </p>
              <div className="pt-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Add optional X handle (@username)"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="w-1/2 px-2 py-1 border border-black rounded text-[10px]"
                />
                <input
                  type="text"
                  placeholder="Add portfolio URL"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-1/2 px-2 py-1 border border-black rounded text-[10px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* QR Code Canvas Display Box */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111]">
          <div
            ref={qrCanvasRef}
            className="p-3 bg-[#FFF9E8] border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <QRCodeCanvas
              value={qrValue}
              size={130}
              bgColor="#FFF9E8"
              fgColor="#111111"
              level="M"
              marginSize={1}
            />
          </div>

          <div className="flex-1 text-left space-y-2">
            <div className="text-xs font-mono-custom font-bold text-[#111111]">
              {qrType === 'VCARD' && '📸 Scan with Phone Camera to add contact info'}
              {qrType === 'TWITTER' && '🔗 Direct X / Twitter Profile Link'}
              {qrType === 'GITHUB' && '💻 Direct GitHub Profile Link'}
              {qrType === 'CUSTOM' && '🌐 Direct Website Link'}
            </div>

            <p className="text-[10px] font-mono-custom text-gray-600 line-clamp-2 break-all bg-gray-50 p-1.5 rounded border border-gray-200">
              {qrValue}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 py-1.5 px-3 bg-[#FFD600] hover:bg-[#e6c200] text-[#111111] font-mono-custom text-[11px] font-bold border border-black rounded-lg shadow-[2px_2px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SAVE QR</span>
              </button>

              <button
                type="button"
                onClick={handleCopyQrContent}
                className="flex-1 py-1.5 px-3 bg-white hover:bg-gray-100 text-[#111111] font-mono-custom text-[11px] font-bold border border-black rounded-lg shadow-[2px_2px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedQr ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#006B3C]" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#FF007A]" />
                    <span>COPY LINK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

