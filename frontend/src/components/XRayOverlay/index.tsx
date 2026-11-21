import React, { useState, useMemo, useCallback } from 'react';
import { useIntelligenceStore } from '../../store/intelligenceStore';
import useScanStore from '../../store/scanStore';

// ══════════════════════════════════════════════════════════════════════════════
// XRayOverlay — Toggle overlay for source panel analysis (#22)
// Highlights framework boundaries, component regions, API zones, trackers
// ══════════════════════════════════════════════════════════════════════════════

interface XRayCategory {
  id: string;
  label: string;
  color: string;
  icon: string;
  pattern: RegExp;
  description: string;
}

const XRAY_CATEGORIES: XRayCategory[] = [
  {
    id: 'framework',
    label: 'Framework',
    color: '#a855f7',
    icon: '⬡',
    pattern: /(__next|__nuxt|__svelte|react-root|ng-app|vue-app|data-reactroot|data-react|__gatsby)/gi,
    description: 'Framework markers and root boundaries',
  },
  {
    id: 'components',
    label: 'Components',
    color: '#06b6d4',
    icon: '◈',
    pattern: /(data-component|data-testid|class="[^"]*component[^"]*"|id="[^"]*component[^"]*")/gi,
    description: 'Component boundaries and test IDs',
  },
  {
    id: 'api',
    label: 'API Zones',
    color: '#2ea86a',
    icon: '⟐',
    pattern: /(api\/|\/graphql|fetch\(|XMLHttpRequest|\.json"|endpoint|webhook)/gi,
    description: 'API endpoints and data fetching zones',
  },
  {
    id: 'trackers',
    label: 'Trackers',
    color: '#e02840',
    icon: '⚠',
    pattern: /(google-analytics|gtag|fbevents|hotjar|mixpanel|segment|amplitude|sentry|datadog|pixel|tracking|analytics)/gi,
    description: 'Analytics, tracking pixels, and telemetry',
  },
  {
    id: 'scripts',
    label: 'Scripts',
    color: '#d4820a',
    icon: '◉',
    pattern: /(<script[^>]*>|<\/script>)/gi,
    description: 'Script boundaries and injection points',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    color: '#f472b6',
    icon: '⎔',
    pattern: /(cdn\.|cloudflare|amazonaws|vercel|netlify|firebase|herokuapp|azure|gstatic|cloudfront)/gi,
    description: 'CDN, hosting, and infrastructure references',
  },
  {
    id: 'security',
    label: 'Security',
    color: '#ef4444',
    icon: '⛊',
    pattern: /(csrf|token|auth|password|secret|api[_-]?key|credentials|Bearer|nonce)/gi,
    description: 'Security-sensitive patterns and tokens',
  },
];

export const XRayOverlay: React.FC = () => {
  const { isXRayMode, setXRayMode } = useIntelligenceStore();
  const { htmlSource } = useScanStore();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(['framework', 'api', 'trackers']));
  const [showLegend, setShowLegend] = useState(true);

  // Compute matches
  const xrayResults = useMemo(() => {
    if (!htmlSource || !isXRayMode) return [];

    const results: { category: XRayCategory; matches: { text: string; index: number; line: number }[] }[] = [];

    for (const cat of XRAY_CATEGORIES) {
      if (!activeCategories.has(cat.id)) continue;

      const matches: { text: string; index: number; line: number }[] = [];
      let match: RegExpExecArray | null;
      const regex = new RegExp(cat.pattern.source, cat.pattern.flags);

      while ((match = regex.exec(htmlSource)) !== null) {
        const beforeMatch = htmlSource.substring(0, match.index);
        const line = (beforeMatch.match(/\n/g) || []).length + 1;
        matches.push({ text: match[0], index: match.index, line });
      }

      if (matches.length > 0) {
        results.push({ category: cat, matches });
      }
    }

    return results;
  }, [htmlSource, isXRayMode, activeCategories]);

  const totalHits = useMemo(() => xrayResults.reduce((sum, r) => sum + r.matches.length, 0), [xrayResults]);

  const toggleCategory = useCallback((catId: string) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  if (!htmlSource) return null;

  return (
    <div className={`xray-overlay-panel ${isXRayMode ? 'active' : ''}`}>
      {/* Toggle Button */}
      <button
        className={`xray-toggle-btn ${isXRayMode ? 'active' : ''}`}
        onClick={() => setXRayMode(!isXRayMode)}
        title="Toggle X-Ray Mode"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M4.93 4.93l14.14 14.14" />
          <path d="M19.07 4.93L4.93 19.07" />
        </svg>
        <span>X-RAY</span>
        {isXRayMode && <span className="xray-hit-count">{totalHits}</span>}
      </button>

      {/* Panel Content */}
      {isXRayMode && (
        <div className="xray-content">
          {/* Category Toggles */}
          <div className="xray-categories">
            {XRAY_CATEGORIES.map(cat => {
              const isActive = activeCategories.has(cat.id);
              const matchCount = xrayResults.find(r => r.category.id === cat.id)?.matches.length || 0;

              return (
                <button
                  key={cat.id}
                  className={`xray-cat-btn ${isActive ? 'active' : ''}`}
                  style={{ '--cat-color': cat.color } as React.CSSProperties}
                  onClick={() => toggleCategory(cat.id)}
                  title={cat.description}
                >
                  <span className="xray-cat-icon">{cat.icon}</span>
                  <span className="xray-cat-label">{cat.label}</span>
                  {matchCount > 0 && <span className="xray-cat-count">{matchCount}</span>}
                </button>
              );
            })}
          </div>

          {/* Results */}
          <div className="xray-results">
            {xrayResults.length === 0 ? (
              <div className="xray-empty">
                <span style={{ opacity: 0.4, fontSize: '0.7rem', fontFamily: 'var(--mono)' }}>
                  No matches for selected categories
                </span>
              </div>
            ) : (
              xrayResults.map((result, i) => (
                <div key={i} className="xray-result-group">
                  <div className="xray-result-header" style={{ borderLeftColor: result.category.color }}>
                    <span style={{ color: result.category.color }}>{result.category.icon}</span>
                    <span className="xray-result-title">{result.category.label}</span>
                    <span className="xray-result-badge" style={{ background: `${result.category.color}22`, color: result.category.color }}>
                      {result.matches.length}
                    </span>
                  </div>

                  <div className="xray-matches">
                    {result.matches.slice(0, 15).map((match, j) => (
                      <div key={j} className="xray-match-item" style={{ animationDelay: `${j * 30}ms` }}>
                        <span className="xray-match-line" style={{ color: result.category.color }}>L{match.line}</span>
                        <code className="xray-match-text">{match.text.length > 60 ? match.text.slice(0, 60) + '…' : match.text}</code>
                      </div>
                    ))}
                    {result.matches.length > 15 && (
                      <div className="xray-match-overflow">
                        +{result.matches.length - 15} more matches
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="xray-legend">
              <div className="xray-legend-header">
                <span>LEGEND</span>
                <button className="xray-legend-close" onClick={() => setShowLegend(false)}>✕</button>
              </div>
              {XRAY_CATEGORIES.filter(c => activeCategories.has(c.id)).map(cat => (
                <div key={cat.id} className="xray-legend-item">
                  <span className="xray-legend-swatch" style={{ background: cat.color }} />
                  <span className="xray-legend-label">{cat.label}</span>
                  <span className="xray-legend-desc">{cat.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XRayOverlay;
