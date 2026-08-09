import React from 'react';
import { Metadata } from 'next';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at JSS | JSS Marketplace',
  description: 'Join our team building the future of e-commerce and multi-vendor trade in India.',
};

export default function CareersPage() {
  const openings = [
    { title: 'Full Stack Engineer (Next.js / Laravel)', location: 'Mumbai / Remote', dept: 'Engineering' },
    { title: 'Vendor Onboarding Specialist', location: 'Pune / Onsite', dept: 'Business Development' },
    { title: 'Logistics Operations Lead', location: 'Delhi NCR / Onsite', dept: 'Supply Chain' },
    { title: 'UI/UX Product Designer', location: 'Remote', dept: 'Design' }
  ];

  return (
    <FooterPageLayout
      title="Careers at JSS Marketplace"
      subtitle="Help us empower millions of Indian sellers and build next-generation marketplace technology."
      categoryName="Company"
    >
      <div className="space-y-6">
        <h2 className="text-base font-black text-foreground">Current Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openings.map((job, idx) => (
            <div key={idx} className="bg-card border border-border-custom p-6 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md">{job.dept}</span>
                <h3 className="font-extrabold text-sm text-foreground mt-2">{job.title}</h3>
                <p className="text-xs text-muted-custom flex items-center gap-1 mt-1">
                  <MapPin size={12} />
                  <span>{job.location}</span>
                </p>
              </div>
              <a href="mailto:careers@jsssolutions.com" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline pt-2">
                <span>Apply via Email</span>
                <ArrowRight size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </FooterPageLayout>
  );
}
