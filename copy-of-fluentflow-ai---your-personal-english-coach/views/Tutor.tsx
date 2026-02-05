
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { encodePCM, decodeBase64, decodeAudioData } from '../services/geminiService';

const Tutor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  const handleKeySetup = async () => {
    try {
      if (typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
        // 按照规范，触发 openSelectKey 后假设成功并继续
        startSession();
      } else {
        setError("API Key selection is not available in this environment.");
      }
    } catch (err) {
      setError("Failed to open key selection dialog.");
    }
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      setError(null);
      
      // 每次创建新实例以确保使用最新的 API KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encodePCM(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              const bytes = decodeBase64(base64Audio);
              const audioBuffer = await decodeAudioData(bytes, outputCtx, 24000, 1);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error', e);
            const msg = e instanceof Error ? e.message : 'Unknown connection error';
            if (msg.includes('Requested entity was not found') || msg.includes('Region not supported')) {
              setError("Region restricted or Invalid Key. Please try selecting a Paid Project Key.");
            } else {
              setError(`Connection failed: ${msg}`);
            }
            setIsActive(false);
            setStatus('idle');
          },
          onclose: () => {
            console.log('Session closed');
            setIsActive(false);
            setStatus('idle');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are a patient and friendly native English tutor. Engage the user in casual conversation. Speak clearly and encourage them to express themselves.'
        }
      });
      
      sessionRef.current = await sessionPromise;
      setIsActive(true);
    } catch (err) {
      console.error(err);
      setError('Microphone access denied or connection failed.');
      setStatus('idle');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      setIsActive(false);
      setStatus('idle');
      streamRef.current?.getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col items-center justify-center space-y-12 animate-fadeIn">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900">AI Native Tutor</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Talk to our AI coach in real-time. Practice your listening and speaking skills naturally.
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-64 h-64 rounded-full bg-blue-400 opacity-20 animate-ping`}></div>
            <div className={`absolute w-48 h-48 rounded-full bg-blue-300 opacity-30 animate-pulse`}></div>
          </div>
        )}

        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={status === 'connecting'}
          className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 scale-in-center ${
            isActive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'connecting' ? (
             <i className="fas fa-circle-notch fa-spin text-white text-5xl"></i>
          ) : isActive ? (
            <i className="fas fa-stop text-white text-5xl"></i>
          ) : (
            <i className="fas fa-microphone text-white text-5xl"></i>
          )}
        </button>
      </div>

      <div className="text-center w-full max-w-md">
        <div className={`px-6 py-2 rounded-full inline-block font-bold text-sm uppercase tracking-widest mb-6 ${
          status === 'listening' ? 'bg-emerald-100 text-emerald-700' :
          status === 'speaking' ? 'bg-blue-100 text-blue-700' :
          status === 'connecting' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
        }`}>
          {status === 'listening' ? 'AI is Listening...' :
           status === 'speaking' ? 'AI is Speaking...' :
           status === 'connecting' ? 'Connecting...' : 'Tutor Offline'}
        </div>

        {error && (
          <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] text-center animate-slideIn">
             <p className="text-rose-600 text-sm font-bold mb-3">{error}</p>
             <button 
               onClick={handleKeySetup}
               className="text-xs bg-rose-600 text-white px-4 py-2 rounded-full font-bold hover:bg-rose-700 transition-colors"
             >
               Switch to Paid API Key
             </button>
             <p className="mt-3 text-[10px] text-rose-400">
               Note: Live API may be restricted in some regions. Using a key from a paid GCP project can often bypass this.
             </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-2xl pt-8 border-t border-slate-100">
        <div className="text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Voice</p>
          <p className="text-slate-800 font-bold">Zephyr</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Status</p>
          <p className="text-slate-800 font-bold">Real-time</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Focus</p>
          <p className="text-slate-800 font-bold">Fluency</p>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
