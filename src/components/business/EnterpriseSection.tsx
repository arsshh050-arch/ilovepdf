import React from 'react';
import {
  Workflow,
  Sparkles,
  ShieldCheck,
  Headphones,
  Users,
  Code2
} from 'lucide-react';

export function EnterpriseSection() {
  const cards = [
    {
      icon: Workflow,
      title: 'Streamline workflows',
      description: 'Establish standardized PDF conversion and editing routines across all business departments.',
      status: 'Live & Ready',
      statusType: 'live'
    },
    {
      icon: Sparkles,
      title: 'AI-assisted document processing',
      description: 'Leverage AI for automated document key-value extraction and intelligent text summarization.',
      status: 'Live & Ready',
      statusType: 'live'
    },
    {
      icon: ShieldCheck,
      title: 'Security controls',
      description: 'Role-based authorization permissions, session activity logs, and strict AES file encryption.',
      status: 'Available with enterprise setup',
      statusType: 'setup'
    },
    {
      icon: Headphones,
      title: 'Priority support',
      description: 'Dedicated customer support channels and technical guidance for rapid team onboarding.',
      status: 'Available with enterprise setup',
      statusType: 'setup'
    },
    {
      icon: Users,
      title: 'Team management',
      description: 'Centralized admin management dashboard, member invites, and shared license provisioning.',
      status: 'Planned',
      statusType: 'planned'
    },
    {
      icon: Code2,
      title: 'API automation',
      description: 'High-speed REST API endpoints to automate server-to-server PDF conversion pipelines.',
      status: 'Live & Ready',
      statusType: 'live'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FC] border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7157E8] bg-[#F3E8FF] px-3.5 py-1 rounded-full">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-4">
            Designed to scale with your organization
          </h2>
          <p className="text-base text-[#686B74]">
            Flexible infrastructure capable of adapting to growing document volumes, multi-department requirements, and custom API integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-[#E0E2E8] shadow-sm flex flex-col justify-between hover:border-[#D4D6DE] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F8FC] text-[#272830] border border-[#E0E2E8] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    {card.statusType === 'live' && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E6F4EA] text-[#34A853]">
                        {card.status}
                      </span>
                    )}
                    {card.statusType === 'setup' && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8]">
                        {card.status}
                      </span>
                    )}
                    {card.statusType === 'planned' && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[#5F6368]">
                        {card.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#272830] mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#686B74] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
