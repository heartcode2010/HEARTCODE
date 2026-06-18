/**
 * useScan — high-level hook that encapsulates the full scan workflow.
 *
 * Wraps the low-level Zustand store mutations and api calls in a single,
 * reusable interface so any component can trigger scans without coupling
 * directly to the API layer.
 */
import { useCallback } from 'react';
import useScanStore from '../store/scanStore';
import api from '../services/api';

export type ScanModule = 'vuln' | 'ai' | 'tech';

export function useScan() {
  const {
    scanId, findings,
    setStatus, setFindings, setTechStack, showToast,
  } = useScanStore();

  const triggerScan = useCallback(async (type: ScanModule) => {
    if (!scanId) return;

    const configs: Record<ScanModule, {
      status: string;
      endpoint: string;
      onSuccess: (data: any) => void;
      failLabel: string;
    }> = {
      vuln: {
        status: 'Scanning…',
        endpoint: '/scans/vulnerability',
        failLabel: 'Scan failed',
        onSuccess: (data) => {
          setFindings(data.findings, null);
          setStatus('ok', 'Scan complete');
          const c = data.findings.length;
          showToast('⚠️', `${c} finding${c !== 1 ? 's' : ''} detected`);
        },
      },
      ai: {
        status: 'Detecting AI…',
        endpoint: '/scans/ai-detect',
        failLabel: 'AI detect failed',
        onSuccess: (data) => {
          setFindings(findings, data.aiAnalysis);
          setStatus('ok', 'AI detect done');
          showToast('🤖', `${data.aiAnalysis.score}% AI confidence`);
        },
      },
      tech: {
        status: 'Detecting tech…',
        endpoint: '/scans/tech-stack',
        failLabel: 'Tech detect failed',
        onSuccess: (data) => {
          setTechStack(data.techStack);
          setStatus('ok', 'Tech stack done');
          showToast('🔬', `${data.techStack.length} technologies detected`);
        },
      },
    };

    const cfg = configs[type];
    setStatus('working', cfg.status);

    try {
      const res = await api.post(cfg.endpoint, { scanId });
      if (res.data?.success) {
        cfg.onSuccess(res.data);
      }
    } catch (err: any) {
      setStatus('fail', cfg.failLabel);
      showToast('⚠️', err.response?.data?.message || cfg.failLabel);
    }
  }, [scanId, findings, setStatus, setFindings, setTechStack, showToast]);

  return { triggerScan };
}
