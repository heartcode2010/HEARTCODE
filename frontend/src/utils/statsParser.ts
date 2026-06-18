import type { ScanStats } from '../types';

/**
 * Compute stats from raw HTML source.
 * Direct port from HEARTCODE.html lines 1894-1904.
 */
export function parseStats(html: string): ScanStats {
  const kb = new Blob([html]).size / 1024;
  return {
    size: kb >= 100 ? Math.round(kb) + ' KB' : kb.toFixed(1) + ' KB',
    lines: html.split('\n').length,
    tagsCount: (html.match(/<[a-zA-Z]/g) || []).length,
    scriptsCount: (html.match(/<script/gi) || []).length,
    stylesCount: (html.match(/<style|<link[^>]+stylesheet/gi) || []).length,
    imagesCount: (html.match(/<img/gi) || []).length,
  };
}

export default parseStats;
