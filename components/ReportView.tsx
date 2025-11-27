import React from 'react';
import { ActionPlanReport, ActionStep } from '../types';
import { Printer, ArrowRight, FileText, Target, AlertTriangle, Shield } from 'lucide-react';

interface Props {
  report: ActionPlanReport;
  onReset: () => void;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-slate-100 border-y border-slate-300 py-2 px-4 mt-8 mb-4">
    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
  </div>
);

const Box: React.FC<{ label: string; content: string; minHeight?: string }> = ({ label, content, minHeight = "h-32" }) => (
  <div className="border border-slate-300 rounded-sm flex flex-col md:flex-row overflow-hidden bg-white">
    <div className="md:w-1/4 bg-slate-50 p-4 border-b md:border-b-0 md:border-r border-slate-300 flex flex-col justify-center">
      <span className="font-bold text-slate-700 text-sm">{label}</span>
    </div>
    <div className={`md:w-3/4 p-4 text-slate-800 leading-relaxed text-sm whitespace-pre-wrap ${minHeight}`}>
      {content}
    </div>
  </div>
);

export const ReportView: React.FC<Props> = ({ report, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto pb-20 font-sans text-slate-900">
      
      <div className="bg-white shadow-lg border border-slate-200 p-8 md:p-12 min-h-[1000px]">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 tracking-tight">Personal Action Plan</h1>
            <p className="text-slate-500 mt-2">Executive Development: Self-Assessment Outcome</p>
          </div>
          <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>

        <div className="prose max-w-none mb-8">
           <p className="text-slate-600 italic">
             This document serves as a draft strategic development plan derived from your self-assessment and reflections. 
             Use this as a basis for discussion with your mentor or executive coach.
           </p>
        </div>

        {/* Part 1: Synthesis */}
        <SectionHeader title="1. Diagnosis & Synthesis" />
        <div className="grid gap-6">
          <Box 
            label="Key Strengths" 
            content={report.synthesis.keyStrengths} 
            minHeight="h-auto"
          />
          <Box 
            label="Key Priorities / Derailers" 
            content={report.synthesis.keyPriorities}
            minHeight="h-auto"
          />
        </div>

        {/* Part 2: Development Need */}
        <SectionHeader title="2. Development Need" />
        <div className="border border-slate-300 rounded-sm overflow-hidden mb-6">
          <div className="bg-indigo-50 p-4 border-b border-slate-300">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Focus Area</span>
            <div className="text-xl font-bold text-indigo-900 mt-1">{report.developmentPlan.focusArea}</div>
          </div>
          <div className="grid grid-cols-1 divide-y md:divide-y-0 border-slate-300">
             <Box label="Reason for Choosing" content={report.developmentPlan.reasonForChoosing} minHeight="h-24" />
          </div>
        </div>

        <div className="grid gap-6">
          <Box 
            label="Goal (SMART)" 
            content={report.developmentPlan.goalSMART}
            minHeight="h-28"
          />
           <Box 
            label="Benefits" 
            content={report.developmentPlan.benefits}
            minHeight="h-24"
          />
        </div>

        {/* Part 3: Risk Mitigation */}
        <SectionHeader title="3. Obstacles & Mitigation" />
        <div className="grid md:grid-cols-2 gap-6">
           <div className="border border-slate-300 rounded-sm bg-white p-4">
              <div className="flex items-center gap-2 mb-3 text-amber-700 font-bold text-sm uppercase">
                <AlertTriangle size={16} /> Obstacles & Risks
              </div>
              <p className="text-sm text-slate-700">{report.developmentPlan.obstacles} {report.developmentPlan.risks}</p>
           </div>
           <div className="border border-slate-300 rounded-sm bg-white p-4">
              <div className="flex items-center gap-2 mb-3 text-green-700 font-bold text-sm uppercase">
                <Shield size={16} /> Mitigation Strategy
              </div>
              <p className="text-sm text-slate-700">{report.developmentPlan.mitigation}</p>
           </div>
        </div>

        {/* Part 4: Action Steps */}
        <SectionHeader title="4. Action Steps (70/20/10)" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-3 text-left w-1/6 text-slate-700 font-bold">Approach</th>
                <th className="border border-slate-300 p-3 text-left w-3/6 text-slate-700 font-bold">Action</th>
                <th className="border border-slate-300 p-3 text-left w-1/6 text-slate-700 font-bold">Target</th>
                <th className="border border-slate-300 p-3 text-center w-1/6 text-slate-700 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.actionSteps.map((step, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="border border-slate-300 p-3 font-medium text-slate-900">
                    {step.approach}
                  </td>
                  <td className="border border-slate-300 p-3 text-slate-700">
                    {step.action}
                  </td>
                  <td className="border border-slate-300 p-3 text-slate-600 italic">
                    {step.targetDate}
                  </td>
                   <td className="border border-slate-300 p-3 text-center">
                    <div className="w-4 h-4 border-2 border-slate-300 rounded mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-400">
          <span>Generated by Pinnacle Leadership Assessment</span>
          <span>Confidential Development Document</span>
        </div>
      </div>

      <div className="text-center mt-8 print:hidden">
        <button 
          onClick={onReset}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 mx-auto transition-colors shadow-lg"
        >
          Start New Assessment <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};