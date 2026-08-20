import React from 'react';
import { ShieldCheck, Users, Globe2, Cpu } from 'lucide-react';

export function TrustBar() {
  const trustItems = [
    {
      icon: ShieldCheck,
      color: 'text-[#34A853]',
      bg: 'bg-[#E6F4EA]',
      title: 'Secure Document Processing',
      description: '256-bit TLS encryption in transit & automatic 2-hour server deletion.'
    },
    {
      icon: Users,
      color: 'text-[#E5322D]',
      bg: 'bg-[#FFF0EE]',
      title: 'Team-Friendly Workflows',
      description: 'Zero software installation or desktop setups required for team members.'
    },
    {
      icon: Globe2,
      color: 'text-[#4285F4]',
      bg: 'bg-[#E8F0FE]',
      title: 'Browser-Based Tools',
      description: 'Instant document processing across Chrome, Safari, Edge, & Firefox.'
    },
    {
      icon: Cpu,
      color: 'text-[#9333EA]',
      bg: 'bg-[#F3E8FF]',
      title: 'Cross-Device Access',
      description: 'Full mobile, tablet, and desktop compatibility across any device.'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#737680] mb-2">
            Trusted Document Productivity
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
            Built for teams that work with documents every day
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F7F8FC] p-6 rounded-xl border border-[#E0E2E8] flex flex-col items-start hover:border-[#D4D6DE] transition-colors"
              >
                <div className={`w-11 h-11 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-4 shrink-0`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-[#272830] text-base mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#686B74] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
