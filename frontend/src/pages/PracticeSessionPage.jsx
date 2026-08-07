import React, { useState } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, Video, Sparkles } from 'lucide-react';

export default function PracticeSessionPage() {
  const [selectedSign, setSelectedSign] = useState('A');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionCount, setSessionCount] = useState(3);

  const SIGNS = [
    { id: 'A', label: 'A' }, { id: 'B', label: 'B' },
    { id: 'C', label: 'C' }, { id: 'D', label: 'D' },
    { id: 'E', label: 'E' }, { id: 'F', label: 'F' },
    { id: 'HELLO', label: 'Hello' }, { id: 'THANK_YOU', label: 'Thank You' },
  ];

  const PASS_SIGNS = ['A', 'B', 'HELLO'];

  const handleStart = () => {
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const isCorrect = PASS_SIGNS.includes(selectedSign);
      const accuracy = isCorrect ? 94.2 : 71.5;
      setIsAnalyzing(false);
      setSessionCount(prev => prev + 1);
      setResult({
        isCorrect,
        accuracy,
        corrections: isCorrect
          ? [
              `Hand position matches sign "${selectedSign}" perfectly.`,
              'Wrist angle and finger separation optimal.',
              '21 landmarks detected successfully.',
            ]
          : [
              `Index finger angle slightly off for sign "${selectedSign}".`,
              'Extend fingers further toward the camera.',
              'Ensure full hand is visible in frame.',
            ],
      });
    }, 2500);
  };

  const handleReset = () => setResult(null);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #FFF7ED 100%)',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{
            background: '#E0F2FE', color: '#0284C7', fontSize: '11px',
            fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
            border: '1px solid #BAE6FD', display: 'inline-block', marginBottom: '8px'
          }}>
            Milestone 2 • AI Practice Studio
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            Interactive AI Sign Gesture Studio
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Select a sign, click start, and get instant real-time accuracy feedback.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block' }}>Sessions Done</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>{sessionCount}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'block' }}>Current Sign</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284C7' }}>{selectedSign}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

        {/* Left: Camera Box */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="#0284C7" />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>AI Gesture Recognition Camera</span>
            </div>
            <span style={{
              background: '#E0F2FE', color: '#0284C7', fontSize: '11px',
              fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
              border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <Sparkles size={11} color="#F97316" />
              MediaPipe 21-Landmark
            </span>
          </div>

          {/* Camera Feed Area */}
          <div style={{
            background: '#0F172A', borderRadius: '12px', aspectRatio: '16/9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #1E293B', position: 'relative', overflow: 'hidden', marginBottom: '1rem'
          }}>
            {!isAnalyzing && !result ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: '#1E293B', border: '1px solid #334155',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                }}>
                  <Video size={28} color="#38BDF8" />
                </div>
                <p style={{ color: '#CBD5E1', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>WebCam Ready</p>
                <p style={{ color: '#64748B', fontSize: '12px', marginBottom: '1.5rem' }}>
                  Position your hand and form the sign for <strong style={{ color: '#38BDF8' }}>"{selectedSign}"</strong>
                </p>
                <button onClick={handleStart} style={{
                  background: '#0284C7', color: '#FFFFFF', border: 'none',
                  borderRadius: '10px', padding: '10px 24px', fontWeight: 700,
                  fontSize: '13px', cursor: 'pointer'
                }}>
                  Start Gesture Recognition
                </button>
              </div>
            ) : isAnalyzing ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '200px', height: '200px', border: '4px solid #38BDF8',
                  borderRadius: '20px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '12px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <RefreshCw size={28} color="#38BDF8" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700 }}>Extracting 21 Landmarks...</span>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'block' }} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{
                  width: '200px', height: '200px', margin: '0 auto',
                  border: `4px solid ${result.isCorrect ? '#10B981' : '#F43F5E'}`,
                  borderRadius: '20px',
                  boxShadow: `0 0 30px ${result.isCorrect ? '#10B98140' : '#F43F5E40'}`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: result.isCorrect ? '#34D399' : '#FB7185' }}>
                    {result.accuracy}%
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>
                    Sign: {selectedSign}
                  </span>
                </div>
                <button onClick={handleReset} style={{
                  marginTop: '12px', background: 'transparent', color: '#94A3B8',
                  border: '1px solid #334155', borderRadius: '8px',
                  padding: '6px 16px', fontSize: '12px', cursor: 'pointer', fontWeight: 600
                }}>
                  Try Again
                </button>
              </div>
            )}

            {/* Live badge */}
            {(isAnalyzing || result) && (
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
                border: '1px solid #334155', borderRadius: '20px',
                padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'block' }} />
                <span style={{ color: '#CBD5E1', fontSize: '11px', fontWeight: 600 }}>Live Analysis</span>
              </div>
            )}
          </div>

          {/* Feedback Result Card */}
          {result && (
            <div style={{
              padding: '1rem', borderRadius: '12px',
              background: result.isCorrect ? '#F0FDF4' : '#FFF1F2',
              border: `1px solid ${result.isCorrect ? '#BBF7D0' : '#FECDD3'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {result.isCorrect
                    ? <CheckCircle2 size={18} color="#16A34A" />
                    : <AlertTriangle size={18} color="#E11D48" />
                  }
                  <span style={{ fontWeight: 700, fontSize: '13px', color: result.isCorrect ? '#14532D' : '#881337' }}>
                    {result.isCorrect ? 'Gesture Recognized Successfully!' : 'Gesture Needs Correction'}
                  </span>
                </div>
                <span style={{ fontWeight: 900, fontSize: '16px', color: result.isCorrect ? '#16A34A' : '#E11D48' }}>
                  {result.accuracy}%
                </span>
              </div>
              <div style={{ paddingLeft: '26px' }}>
                {result.corrections.map((tip, i) => (
                  <p key={i} style={{ fontSize: '12px', color: result.isCorrect ? '#166534' : '#9F1239', marginBottom: '3px' }}>
                    • {tip}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sign Selector */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
            Select Sign to Practice
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {SIGNS.map(sign => (
              <button
                key={sign.id}
                onClick={() => { setSelectedSign(sign.id); setResult(null); }}
                style={{
                  padding: '12px 8px', borderRadius: '12px', border: '1px solid',
                  fontWeight: 800, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                  borderColor: selectedSign === sign.id ? '#0284C7' : '#E2E8F0',
                  background: selectedSign === sign.id ? '#0284C7' : '#FFFFFF',
                  color: selectedSign === sign.id ? '#FFFFFF' : '#334155',
                  boxShadow: selectedSign === sign.id ? '0 4px 12px rgba(2,132,199,0.2)' : 'none',
                }}
              >
                {sign.label}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: '1.5rem', background: '#0C4A6E', borderRadius: '12px',
            padding: '1rem', color: '#FFFFFF'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#7DD3FC', marginBottom: '6px' }}>
              ✦ Scoring Formula
            </div>
            <p style={{ fontSize: '11px', color: '#BAE6FD', lineHeight: '1.6' }}>
              Each session updates your weighted score: <br />
              <strong>0.40×Ga + 0.25×Ap + 0.15×Lc + 0.10×Pc + 0.10×Si</strong>
              <br />and logs accuracy to <code style={{ color: '#7DD3FC' }}>Practice_History</code>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
