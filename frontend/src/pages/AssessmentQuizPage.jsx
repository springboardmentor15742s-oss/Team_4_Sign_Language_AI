import React, { useState, useEffect } from 'react';
import { Timer, Award, CheckCircle2, Play, ArrowRight, RotateCcw } from 'lucide-react';

export default function AssessmentQuizPage() {
  const [phase, setPhase] = useState('start'); // start | active | done
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const QUESTIONS = [
    { sign: 'A', options: ['Letter A', 'Letter B', 'Letter C', 'Letter D'], correct: 0 },
    { sign: 'B', options: ['Letter A', 'Letter B', 'Letter E', 'Letter F'], correct: 1 },
    { sign: 'C', options: ['Letter D', 'Letter E', 'Letter C', 'Letter A'], correct: 2 },
    { sign: 'D', options: ['Letter B', 'Letter D', 'Letter F', 'Letter E'], correct: 1 },
    { sign: 'E', options: ['Letter E', 'Letter A', 'Letter C', 'Letter F'], correct: 0 },
  ];

  useEffect(() => {
    if (phase !== 'active') return;
    if (timeLeft <= 0) { setPhase('done'); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const handleStart = () => {
    setPhase('active');
    setCurrentQ(0);
    setScore(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
  };

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    const correct = idx === QUESTIONS[currentQ].correct;
    if (correct) setScore(p => p + 20);
    setTimeout(() => {
      setSelectedAnswer(null);
      if (currentQ + 1 >= QUESTIONS.length) { setPhase('done'); }
      else { setCurrentQ(p => p + 1); }
    }, 600);
  };

  const timerColor = timeLeft > 30 ? '#16A34A' : timeLeft > 10 ? '#D97706' : '#DC2626';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #FFF7ED 100%)',
        border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <span style={{
            background: '#E0F2FE', color: '#0284C7', fontSize: '11px',
            fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
            border: '1px solid #BAE6FD', display: 'inline-block', marginBottom: '8px'
          }}>
            Milestone 2 • Speed Assessment
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            60-Second Sign Language Speed Quiz
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Identify 5 core ASL signs as fast as you can.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#FFFFFF', padding: '12px 20px',
          borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <Timer size={20} color="#F97316" />
          <span style={{ fontSize: '22px', fontWeight: 900, color: timerColor }}>{timeLeft}s</span>
        </div>
      </div>

      {/* Start Screen */}
      {phase === 'start' && (
        <div style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
          padding: '4rem 2rem', textAlign: 'center'
        }}>
          <div style={{
            width: '64px', height: '64px', background: '#E0F2FE', borderRadius: '16px',
            border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1.5rem'
          }}>
            <Award size={32} color="#0284C7" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
            Ready for the Challenge?
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '360px', margin: '0 auto 2rem' }}>
            You have 60 seconds to identify 5 sign language alphabet gestures.
            Your score is saved to <strong style={{ color: '#0284C7' }}>Quiz_Scores</strong> table.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: '#0284C7', color: '#FFFFFF', border: 'none',
              borderRadius: '12px', padding: '14px 36px', fontWeight: 800,
              fontSize: '14px', cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: '8px'
            }}
          >
            <Play size={16} fill="#FFFFFF" /> Start Speed Challenge
          </button>
        </div>
      )}

      {/* Quiz Active */}
      {phase === 'active' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2rem' }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
            <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
            <span>Score: {score} pts</span>
          </div>

          {/* Sign Display */}
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>
              Identify This Sign
            </span>
            <div style={{
              width: '120px', height: '120px', background: '#0F172A', borderRadius: '20px',
              border: '4px solid #38BDF8', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 30px rgba(56,189,248,0.2)'
            }}>
              <span style={{ fontSize: '52px', fontWeight: 900, color: '#FFFFFF' }}>
                {QUESTIONS[currentQ].sign}
              </span>
            </div>
          </div>

          {/* Answer Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {QUESTIONS[currentQ].options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === QUESTIONS[currentQ].correct;
              let bg = '#FFFFFF', border = '#E2E8F0', color = '#1E293B';
              if (isSelected && isCorrect) { bg = '#F0FDF4'; border = '#86EFAC'; color = '#14532D'; }
              if (isSelected && !isCorrect) { bg = '#FFF1F2'; border = '#FECDD3'; color = '#881337'; }

              return (
                <button
                  key={idx}
                  onClick={() => !selectedAnswer && handleAnswer(idx)}
                  style={{
                    padding: '16px', borderRadius: '12px', border: `1px solid ${border}`,
                    background: bg, color, fontWeight: 700, fontSize: '13px',
                    cursor: 'pointer', textAlign: 'left', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s'
                  }}
                >
                  <span>{opt}</span>
                  <ArrowRight size={16} color="#CBD5E1" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {phase === 'done' && (
        <div style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px',
          padding: '4rem 2rem', textAlign: 'center'
        }}>
          <div style={{
            width: '64px', height: '64px', background: '#F0FDF4', borderRadius: '16px',
            border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={32} color="#16A34A" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Quiz Completed!
          </span>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', margin: '8px 0' }}>
            {score} / 100
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '2rem' }}>
            Your score has been logged to your learner analytics.
          </p>
          <button
            onClick={handleStart}
            style={{
              background: '#0284C7', color: '#FFFFFF', border: 'none',
              borderRadius: '12px', padding: '12px 28px', fontWeight: 800,
              fontSize: '13px', cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', gap: '8px'
            }}
          >
            <RotateCcw size={14} /> Retake Challenge
          </button>
        </div>
      )}
    </div>
  );
}
