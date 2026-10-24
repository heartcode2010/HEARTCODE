import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ComingSoon } from '../components/Shared/ComingSoon';

const QuizVersePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        <ComingSoon 
          title="QUIZVERSE STUDIO" 
          subtitle="LEARNING MODULE COMPILER" 
          features={[
            'Interactive assessment engine',
            'Dynamic question generation and scoring',
            'Progress tracking and performance analytics'
          ]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default QuizVersePage;
