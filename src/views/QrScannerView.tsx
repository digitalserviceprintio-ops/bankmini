import React, { useState, useEffect, useRef } from 'react';
import { useSavings } from '../context/SavingsContext';
import { formatRupiah } from '../data/mockData';
import {
  Camera,
  QrCode,
  Zap,
  ZapOff,
  RotateCcw,
  CheckCircle2,
  ArrowDownLeft,
  BookOpen,
  Sparkles,
  Search,
} from 'lucide-react';

export const QrScannerView: React.FC = () => {
  const { students, setActiveStudent, setActiveTab, showToast } = useSavings();

  const [scannedStudent, setScannedStudent] = useState<typeof students[0] | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Synthesize gentle beep sound when card detected
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  };

  // Attempt real camera access
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.warn('Camera preview restricted in iframe sandboxes:', err);
        setCameraError('Kamera fisik tidak tersedia di pratinjau browser ini. Gunakan simulasi scan otomatis di bawah.');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = (s: typeof students[0]) => {
    playBeep();
    setScannedStudent(s);
    setActiveStudent(s);
    showToast(`Kartu ${s.name} berhasil dipindai!`, 'success');
  };

  const handleProceedToDeposit = () => {
    if (scannedStudent) {
      setActiveStudent(scannedStudent);
      setActiveTab('transaksi');
    }
  };

  const handleProceedToBook = () => {
    if (scannedStudent) {
      setActiveStudent(scannedStudent);
      setActiveTab('buku');
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pt-3 pb-24 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pindai Kartu Siswa</h2>
          <p className="text-xs text-slate-500">
            Arahkan kamera ke QR code atau barcode kartu tabungan
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              flashOn ? 'bg-amber-100 text-amber-700' : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            {flashOn ? <Zap className="w-4 h-4 fill-amber-500" /> : <ZapOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Camera Viewfinder Box */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 flex items-center justify-center border-4 border-slate-900 shadow-xl">
        {/* Real Video element if accessible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
        />

        {/* Fallback Camera Graphic */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-400">
            <Camera className="w-12 h-12 text-slate-600 mb-2 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Sensor Pemindai QR Aktif</span>
            <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Arahkan kartu tabungan siswa ke dalam bingkai pemindai hijau
            </span>
          </div>
        )}

        {/* Target Reticle Frame */}
        <div className="relative z-10 w-48 h-48 border-2 border-dashed border-emerald-400/70 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          {/* 4 Corner Markers */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>

          {/* Animated Scanning Laser Beam */}
          <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-pulse"></div>

          <QrCode className="w-12 h-12 text-emerald-400/40" />
        </div>

        {/* Bottom indicator inside camera */}
        <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-white/80 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Mencari kode QR / Barcode...</span>
          </span>
          <span className="font-mono text-emerald-300">HD 1080p</span>
        </div>
      </div>

      {/* Scanned Student Result Card (if detected) */}
      {scannedStudent ? (
        <div className="p-4 bg-white rounded-3xl border-2 border-emerald-500/80 shadow-lg flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Kartu Siswa Ditemukan!
              </span>
            </div>
            <button
              onClick={() => setScannedStudent(null)}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-200 w-[52px] h-[52px] border border-slate-300 shrink-0">
              {scannedStudent.photoUrl ? (
                <img
                  src={scannedStudent.photoUrl}
                  alt={scannedStudent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-sm text-slate-700 bg-emerald-100">
                  {scannedStudent.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {scannedStudent.name}
              </h4>
              <p className="text-[11px] text-slate-500">
                {scannedStudent.className} • NIS: {scannedStudent.nis}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-slate-400">Saldo:</span>
                <span className="text-xs font-extrabold text-emerald-700">
                  {formatRupiah(scannedStudent.balance)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleProceedToDeposit}
              className="h-11 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Input Setoran</span>
            </button>
            <button
              onClick={handleProceedToBook}
              className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Buka Buku</span>
            </button>
          </div>
        </div>
      ) : (
        /* Fast Simulator: Click sample student card to simulate instant scan */
        <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                Simulasi Scan Cepat (Pilih Kartu)
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Sentuh untuk scan</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {students.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => handleSimulateScan(s)}
                className="p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                  {s.photoUrl ? (
                    <img src={s.photoUrl} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-700 bg-emerald-100">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400">{s.className} • NIS {s.nis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
