import React, { useState, useEffect } from 'react';
import { ASSESSMENT_STATEMENTS } from './constants';
import { Dimension, ActionPlanReport, TrafficLight, UserReflections, Statement } from './types';
import { generateActionPlan } from './services/gemini';
import { Header } from './components/Header';
import { ReportView } from './components/ReportView';
import { ArrowRight, Loader2, FileText, ChevronRight } from 'lucide-react';

// --- Local Component: Assessment Grid ---
const AssessmentGrid: React.FC<{
  statements: Statement[];
  answers: Record<number, TrafficLight>;
  onAnswer: (id: number, val: TrafficLight) => void;
}> = ({ statements, answers, onAnswer }) => {
  // Group by dimension
  const grouped = statements.reduce((acc, curr) => {
    const key = curr.dimension;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Statement[]>);

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([dim, items]) => (
        <div key={dim} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          {/* Dimension Header */}
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="h-6 w-1 bg-indigo-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800 text-lg">{dim}</h3>
          </div>
          
          {/* Grid Header - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="flex-1 px-6 py-3">Leadership Behaviour Statement</div>
            <div className="w-24 px-2 py-3 text-center">Consistently</div>
            <div className="w-24 px-2 py-3 text-center">Sometimes</div>
            <div className="w-24 px-2 py-3 text-center">Rarely</div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center p-4 md:p-6 hover:bg-slate-50 transition-colors">
                <div className="flex-1 text-slate-700 font-medium mb-4 md:mb-0 md:pr-8 leading-relaxed">
                  {item.text}
                </div>
                
                <div className="flex justify-between md:justify-end gap-4 md:gap-0">
                  {/* Green */}
                  <div className="flex flex-col items-center w-24">
                    <span className="md:hidden text-xs text-slate-400 mb-1">Consistently</span>
                    <button 
                      onClick={() => onAnswer(item.id, 'green')}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        answers[item.id] === 'green' 
                        ? 'bg-green-500 border-green-600 shadow-inner scale-110' 
                        : 'bg-white border-slate-200 hover:border-green-300'
                      }`}
                      aria-label="Consistently"
                    />
                  </div>

                  {/* Amber */}
                  <div className="flex flex-col items-center w-24">
                    <span className="md:hidden text-xs text-slate-400 mb-1">Sometimes</span>
                     <button 
                      onClick={() => onAnswer(item.id, 'amber')}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        answers[item.id] === 'amber' 
                        ? 'bg-amber-400 border-amber-500 shadow-inner scale-110' 
                        : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                      aria-label="Sometimes"
                    />
                  </div>

                  {/* Red */}
                  <div className="flex flex-col items-center w-24">
                    <span className="md:hidden text-xs text-slate-400 mb-1">Rarely</span>
                     <button 
                      onClick={() => onAnswer(item.id, 'red')}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        answers[item.id] === 'red' 
                        ? 'bg-red-500 border-red-600 shadow-inner scale-110' 
                        : 'bg-white border-slate-200 hover:border-red-300'
                      }`}
                      aria-label="Rarely"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---

function App() {
  const [step, setStep] = useState<'intro' | 'assessment' | 'reflection' | 'analyzing' | 'report'>('intro');
  const [answers, setAnswers] = useState<Record<number, TrafficLight>>({});
  const [reflections, setReflections] = useState<UserReflections>({ strengths: '', limitations: '' });
  const [report, setReport] = useState<ActionPlanReport | null>(null);
  
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0,0);
  }, [step]);

  // Log on mount to verify deployment updates
  useEffect(() => {
    console.log("Pinnacle Assessment App Mounted - Revision 7");
  }, []);

  const handleStart = () => setStep('assessment');
  
  const handleAnswer = (id: number, val: TrafficLight) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isAssessmentComplete = ASSESSMENT_STATEMENTS.every(s => answers[s.id] !== undefined && answers[s.id] !== null);

  const handleFinishAssessment = () => {
    if (isAssessmentComplete) setStep('reflection');
  };

  const handleGenerateReport = async () => {
    if (!reflections.strengths.trim() || !reflections.limitations.trim()) return;
    
    setStep('analyzing');
    try {
      const result = await generateActionPlan(answers, reflections);
      setReport(result);
      setStep('report');
    } catch (error) {
      console.error(error);
      // In a real app, handle error state
      setStep('assessment'); // fallback
    }
  };

  const handleReset = () => {
    setAnswers({});
    setReflections({ strengths: '', limitations: '' });
    setReport(null);
    setStep('intro');
  };

  // --- VIEWS ---

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-8 mx-auto">
              <FileText className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Leadership Self-Assessment
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Reflect on your leadership behaviors across <strong>Presence</strong>, <strong>Warmth</strong>, and <strong>Strategic Resilience</strong>. 
              This tool uses a rigorous behavioral framework to help you draft a strategic Personal Action Plan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10 max-w-2xl mx-auto">
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="text-indigo-600 font-bold mb-1">1. Rate</div>
                 <p className="text-sm text-slate-500">Assess frequency of key behaviors using the traffic light system.</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="text-indigo-600 font-bold mb-1">2. Reflect</div>
                 <p className="text-sm text-slate-500">Articulate your perceived strengths and derailers.</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                 <div className="text-indigo-600 font-bold mb-1">3. Plan</div>
                 <p className="text-sm text-slate-500">Receive a drafted strategic document for your development.</p>
               </div>
            </div>

            <button
              onClick={handleStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-10 py-4 rounded-md shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
            >
              Begin Self-Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'assessment') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-4xl mx-auto w-full p-6 pb-24">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Assessment Matrix</h2>
            <p className="text-slate-500">Rate how frequently you demonstrate these behaviors.</p>
          </div>
          
          <AssessmentGrid 
            statements={ASSESSMENT_STATEMENTS} 
            answers={answers} 
            onAnswer={handleAnswer} 
          />
        </main>
        
        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="text-sm text-slate-500 font-medium">
              {Object.keys(answers).length} / {ASSESSMENT_STATEMENTS.length} Rated
            </div>
            <button
              onClick={handleFinishAssessment}
              disabled={!isAssessmentComplete}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                isAssessmentComplete 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Next: Self-Reflection <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'reflection') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="max-w-3xl mx-auto w-full p-6 flex flex-col justify-center min-h-[80vh]">
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Perspective</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Before generating the plan, please articulate your own view. 
              This ensures the final document is grounded in your reality.
            </p>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                  My Key Strengths
                </label>
                <textarea
                  className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                  placeholder="Where do you add the most value? (e.g., 'I am calm in a crisis', 'I build strong networks')"
                  value={reflections.strengths}
                  onChange={(e) => setReflections(prev => ({ ...prev, strengths: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                  My Perceived Limitations / Derailers
                </label>
                <textarea
                  className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32"
                  placeholder="What holds you back? (e.g., 'I avoid conflict', 'I analyze too long')"
                  value={reflections.limitations}
                  onChange={(e) => setReflections(prev => ({ ...prev, limitations: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
               <button
                onClick={handleGenerateReport}
                disabled={!reflections.strengths || !reflections.limitations}
                className={`flex items-center gap-2 px-8 py-4 rounded-md font-semibold shadow-lg transition-all ${
                  (reflections.strengths && reflections.limitations)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Generate Draft Plan <FileText size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-8" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Drafting Personal Action Plan</h2>
            <div className="space-y-3 text-slate-500 text-sm">
              <p className="animate-pulse delay-75">Synthesizing traffic light scores...</p>
              <p className="animate-pulse delay-150">Integrating self-reflection data...</p>
              <p className="animate-pulse delay-300">Formulating SMART goals and mitigation strategies...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (report) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="p-6">
          <ReportView report={report} onReset={handleReset} />
        </main>
      </div>
    );
  }

  return null;
}

export default App;