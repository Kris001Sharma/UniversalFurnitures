import React from 'react';
import { CheckCircle2, ChevronRight, Package, Truck, Box } from 'lucide-react';
import { OrderProgress } from '../types';

export const OrderTracker = ({ orderProgress }: { orderProgress: OrderProgress }) => {
  const steps = [
    { title: 'Material Preparation', icon: Package, stage: 'Prep' },
    { title: 'Manufacturing', icon: Box, stage: 'Manufacturing' },
    { title: 'Quality Check', icon: CheckCircle2, stage: 'QC' },
    { title: 'Ready for Dispatch', icon: Truck, stage: 'Dispatch' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-6">
      <h3 className="font-bold text-slate-900 mb-6">Production Status</h3>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>
        <div className="space-y-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            // Mock logic
            let isCompleted = idx < 2; 
            let isCurrent = idx === 2;
            
            return (
              <div key={idx} className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center relative z-10 transition-colors ${
                  isCompleted ? 'bg-emerald-50 text-emerald-600' :
                  isCurrent ? 'bg-blue-50 text-blue-600' :
                  'bg-slate-50 text-slate-400'
                }`}>
                  <Icon size={20} />
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pt-3">
                  <h4 className={`font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>{step.title}</h4>
                  {isCurrent && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-semibold text-blue-700">Progress</span>
                        <span className="font-bold text-blue-700">65%</span>
                      </div>
                      <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
