import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  BrainCircuit, 
  AlertCircle, 
  Pill, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { explainMedicine } from '../api/medicine.api';

export const AIAssistant: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatHistory, addChatMessage, clearChat } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips
  const suggestedPrompts = [
    'Explain Lipitor side effects',
    'Can I take Metformin with coffee?',
    'What happens if I miss Vitamin D3?',
    'List dangerous drug interactions',
  ];

  // Sync initial query from URL search parameters if any (e.g. ?q=Explain...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      handleSendMessage(query);
      // Clear URL params
      navigate('/ai-assistant', { replace: true });
    }
  }, [location.search]);

  // Auto-scroll to bottom of chat history
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Fallback clinical reply generator
  const getAIResponse = (text: string): string => {
    const query = text.toLowerCase();

    if (query.includes('lipitor') || query.includes('atorvastatin')) {
      return `### Lipitor (Atorvastatin) Clinical Breakdown

**Purpose:** Lipitor is an HMG-CoA reductase inhibitor (statin) used to lower LDL cholesterol and triglyceride levels, reducing cardiovascular risks.

**Recommended Timings:**
- Can be taken at any hour, but consistency is key.
- **Avoid grapefruit juice** as it interferes with liver enzymes (CYP3A4), increasing Lipitor concentration in blood, which heightens side effect risks.

**Key Side Effects:**
- Common: Mild headache, nosebleeds, joint aches.
- Critical Warning: **Unexplained muscle pain or weakness** (potential rhabdomyolysis risk). If experienced, pause intake and contact your doctor immediately.`;
    }

    if (query.includes('metformin')) {
      return `### Metformin Administration Guidelines

**Purpose:** Metformin is a biguanide antihyperglycemic agent prescribed to improve glucose tolerance in patients with Type 2 diabetes.

**Intake Instructions:**
- **Always take with meals** (specifically breakfast or dinner) to minimize gastrointestinal discomfort (bloating, metallic taste, nausea).
- Coffee containing caffeine doesn't interact directly with Metformin, but can worsen digestive sensitivity or skew blood glucose levels.

**Critical Caution:**
- Limit alcohol intake significantly. The combination increases the risk of **lactic acidosis**, a rare but life-threatening complication.`;
    }

    return `### MedoraX AI Coach Response

Thank you for your question. I am checking our clinical databases. 

To help coordinate your treatment schedules safely, please keep in mind:
- Maintain consistent alarm logs.
- Document any side effects immediately in your profile notes.
- If you are starting a new prescription course, use the **Prescription Scan** page to compare compounds against your current list.

*Please note: I am a healthcare coordinator AI. Consult your physician for official prescription instructions.*`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    addChatMessage(textToSend, 'user');
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await explainMedicine({
        medicineName: textToSend,
        dosage: 'standard',
        userAge: 30,
        symptoms: '',
        medicalHistory: '',
        specificQuestion: textToSend,
      });

      setIsTyping(false);
      const data = response.data;
      if (data && (data.summary || data.timingGuidance)) {
        let reply = `### ${textToSend}\n\n`;
        if (data.summary) reply += `**Summary:** ${data.summary}\n\n`;
        if (data.timingGuidance) reply += `**Timing Guidance:** ${data.timingGuidance}\n\n`;
        if (data.foodRecommendation) reply += `**Food Recommendation:** ${data.foodRecommendation}\n\n`;
        if (data.commonSideEffects) reply += `**Common Side Effects:** ${data.commonSideEffects}\n\n`;
        if (data.warningFlags) reply += `**Warnings:** ${data.warningFlags}\n\n`;
        addChatMessage(reply, 'assistant');
      } else {
        addChatMessage(getAIResponse(textToSend), 'assistant');
      }
    } catch (err: any) {
      console.warn('Backend AI explain error, using local reply generator:', err);
      setIsTyping(false);
      addChatMessage(getAIResponse(textToSend), 'assistant');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] text-left gap-4 max-w-4xl mx-auto">
      
      {/* 1. Header panel */}
      <div className="flex justify-between items-center select-none">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">clinical copilot</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">AI Medical Assistant</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl flex items-center gap-1.5 cursor-pointer text-slate-500 border-slate-200 dark:border-zinc-800"
          onClick={clearChat}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Clear chat
        </Button>
      </div>

      {/* 2. Chat Terminal container */}
      <Card className="flex-1 flex flex-col border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214] shadow-xl overflow-hidden min-h-0">
        
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {chatHistory.map((msg) => {
            const isAI = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isAI ? 'justify-start' : 'justify-end'} items-start`}
              >
                {/* AI Sparkles icon */}
                {isAI && (
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 dark:bg-brand-secondary/10 text-brand-primary dark:text-brand-secondary flex items-center justify-center shrink-0 shadow-sm border border-brand-primary/10 select-none mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                )}

                {/* Message text bubble */}
                <div
                  className={`
                    p-4 rounded-[20px] text-xs leading-relaxed max-w-[85%] text-left
                    ${isAI 
                      ? 'border border-slate-100 dark:border-zinc-800/50 bg-slate-50/30 dark:bg-zinc-900/10 text-slate-700 dark:text-zinc-300' 
                      : 'bg-brand-primary text-white shadow-md shadow-brand-primary/10'
                    }
                  `}
                >
                  {isAI ? (
                    // Simple custom renderer to parse markdown formatting like headers, bullet lists, bold text
                    <div className="flex flex-col gap-2.5">
                      {msg.text.split('\n').map((line, idx) => {
                        if (line.startsWith('###')) {
                          return (
                            <h4 key={idx} className="font-extrabold text-sm text-slate-900 dark:text-white mt-1 border-b border-slate-50 dark:border-zinc-800/50 pb-1.5">
                              {line.replace('###', '').trim()}
                            </h4>
                          );
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <span key={idx} className="font-bold text-slate-800 dark:text-zinc-200 mt-1 block">
                              {line.replace(/\*\*/g, '').trim()}
                            </span>
                          );
                        }
                        if (line.startsWith('-') || line.match(/^\d+\./)) {
                          return (
                            <p key={idx} className="pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-brand-primary">
                              {line.replace(/^[-\d\.]+\s*/, '').replace(/\*\*/g, '')}
                            </p>
                          );
                        }
                        return (
                          <p key={idx} className="leading-normal">
                            {line.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-slate-800 dark:text-zinc-100">{part}</strong> : part)}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="font-medium text-slate-50 leading-normal">{msg.text}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing delay indicator */}
          {isTyping && (
            <div className="flex gap-4 justify-start items-start select-none">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10 mt-0.5">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div className="p-4 rounded-[20px] bg-slate-50/30 dark:bg-zinc-900/10 border border-slate-100 dark:border-zinc-800/50 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* anchor for scroll */}
          <div ref={scrollRef} />
        </div>

        {/* Suggested Prompt Chips row (Only visible when chat has minimal messages) */}
        {chatHistory.length <= 2 && !isTyping && (
          <div className="px-6 pb-2 select-none flex flex-wrap gap-2 justify-start">
            {suggestedPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-3.5 py-2 rounded-xl border border-slate-150 dark:border-zinc-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-zinc-900/30 dark:hover:bg-zinc-800/40 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-secondary dark:hover:text-brand-secondary transition-all text-left cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Console bar */}
        <div className="p-4 border-t border-slate-50 dark:border-zinc-800/50 bg-slate-50/30 dark:bg-zinc-900/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask AI Copilot about side effects, timings..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            disabled={isTyping}
            className="flex-1 bg-white dark:bg-zinc-950 border border-slate-150 dark:border-zinc-850 text-slate-800 dark:text-zinc-100 rounded-xl py-3 px-4 text-xs outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 placeholder:text-slate-400"
          />
          <Button
            size="sm"
            onClick={() => handleSendMessage(inputMessage)}
            disabled={isTyping || !inputMessage.trim()}
            className="rounded-xl h-11 w-11 p-0 flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

      </Card>
      
    </div>
  );
};
export default AIAssistant;
