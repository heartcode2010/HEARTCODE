import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { Globe, ArrowLeft, Bookmark, Calendar, MapPin, ExternalLink, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { opportunities, saveOpportunity, oppFilter, setOppFilter } = useMarketplaceStore();

  const filteredOpps = opportunities.filter(opp => {
    if (oppFilter === 'all') return true;
    return opp.type === oppFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col font-sans">
      <Header />
      <div className="flex-1 py-8 px-4 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[#6e6868] hover:text-white text-xs mb-3 cursor-pointer font-mono uppercase tracking-wider">
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Globe size={24} className="text-[#00d4ff]" /> OPPORTUNITY ENGINE
              </h1>
              <p className="text-xs text-[#6e6868] mt-1">Discover scholarships, global internships, developer competitions, research grants, and jobs.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#2a2a2e] pb-4">
            {(['all', 'scholarship', 'internship', 'hackathon', 'competition', 'grant', 'job'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setOppFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${oppFilter === tab ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]' : 'bg-transparent border border-transparent text-[#6e6868] hover:text-white'}`}
              >
                {tab === 'all' ? 'All Opportunities' : `${tab}s`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpps.map(opp => (
              <div key={opp.id} className="bg-[#111114] border border-[#2a2a2e] p-6 rounded-2xl hover:border-[#383842] transition-colors relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[0.58rem] font-mono uppercase bg-[#00d4ff]/10 border border-[#00d4ff]/20 px-2 py-0.5 rounded text-[#00d4ff]">
                      {opp.type}
                    </span>
                    <button
                      onClick={() => saveOpportunity(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${opp.isSaved ? 'bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]' : 'bg-transparent border-[#2a2a2e] text-[#6e6868] hover:text-white'}`}
                    >
                      <Bookmark size={12} className={opp.isSaved ? 'fill-[#f59e0b]' : ''} />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-white mb-2 leading-snug">{opp.title}</h3>
                  <div className="text-[0.62rem] font-mono text-[#6e6868] uppercase mb-4 flex items-center gap-1.5">
                    <span>Org: {opp.organization}</span>
                  </div>

                  <p className="text-xs text-[#b0a8a8] leading-relaxed mb-6">{opp.description}</p>
                </div>

                <div className="border-t border-[#1a1a20] pt-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[0.62rem] font-mono text-[#6e6868] uppercase">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {opp.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> Deadline: {opp.deadline || 'Ongoing'}</span>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Redirecting to portal for: ${opp.title}`);
                    }}
                    className="w-full py-2 bg-white text-black hover:opacity-90 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Apply Now <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
