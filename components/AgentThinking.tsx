'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentThinkingProps {
  steps: string[];
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function AgentThinking({ steps, onComplete, autoStart = true }: AgentThinkingProps) {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!autoStart) return;
    
    let timeout: NodeJS.Timeout;
    
    const typeStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setIsTyping(false);
        setIsDone(true);
        onComplete?.();
        return;
      }

      setIsTyping(true);
      setCurrentStep(stepIndex);
      const step = steps[stepIndex];
      let charIndex = 0;
      setCurrentText('');

      const typeChar = () => {
        if (charIndex < step.length) {
          setCurrentText(step.slice(0, charIndex + 1));
          charIndex++;
          timeout = setTimeout(typeChar, Math.random() * 12 + 8);
        } else {
          // Step complete — add to visible, move to next
          setVisibleSteps(prev => [...prev, step]);
          setCurrentText('');
          timeout = setTimeout(() => typeStep(stepIndex + 1), 400 + Math.random() * 300);
        }
      };

      typeChar();
    };

    const startDelay = setTimeout(() => typeStep(0), 200);
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className="agent-log">
      <AnimatePresence>
        {visibleSteps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="agent-step done"
          >
            <span className="step-icon">✓</span>
            <span className="step-text">{step}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {isTyping && currentText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="agent-step active"
        >
          <span className="step-icon typing-dot" />
          <span className="step-text typing-cursor">{currentText}</span>
        </motion.div>
      )}

      {isDone && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="agent-step final"
        >
          <span className="step-icon">⚡</span>
          <span className="step-text final-text">Analysis complete — action ready for review</span>
        </motion.div>
      )}

      <style jsx>{`
        .agent-log {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 11.5px;
          line-height: 1.7;
          background: rgba(10, 11, 15, 0.6);
          border: 1px solid #1f2435;
          border-radius: 6px;
          padding: 12px 14px;
          max-height: 200px;
          overflow-y: auto;
        }
        .agent-step {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 1px 0;
        }
        .step-icon {
          flex-shrink: 0;
          width: 14px;
          font-size: 10px;
          margin-top: 1px;
        }
        .agent-step.done .step-icon {
          color: #10b981;
        }
        .agent-step.done .step-text {
          color: #4a5168;
        }
        .agent-step.active .step-text {
          color: #8b93a8;
        }
        .agent-step.final .step-icon {
          color: #3b82f6;
        }
        .agent-step.final .step-text {
          color: #3b82f6;
          font-weight: 500;
        }
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          animation: pulse-glow 1s ease-in-out infinite;
          margin-top: 4px;
        }
        .step-text {
          color: #8b93a8;
        }
        .typing-cursor::after {
          content: '▋';
          animation: blink 1s step-end infinite;
          color: #3b82f6;
          font-size: 0.85em;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
