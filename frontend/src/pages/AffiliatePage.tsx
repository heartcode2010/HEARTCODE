import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ComingSoon } from '../components/Shared/ComingSoon';

const AffiliatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <ComingSoon 
          title="AFFILIATE ENGINE" 
          subtitle="MONETIZATION PROTOCOL" 
          features={[
            'Multi-tier referral tracking',
            'Automated commission distributions',
            'Live conversion analytics'
          ]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AffiliatePage;
