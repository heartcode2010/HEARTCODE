import React from 'react';
import useScanStore from '../../store/scanStore';
import { HistoryModal, PasteModal, CopyModal, AiResultModal } from './Modals';

/**
 * Modals - renders all overlay modals driven by scanStore state.
 * Drop this once into Dashboard and all modals are handled.
 */
export const Modals: React.FC = () => {
  const {
    isHistoryOpen, setHistoryOpen,
    isPasteOpen, setPasteOpen,
    isCopyOpen, setCopyOpen,
    isAiOpen, setAiOpen,
  } = useScanStore();

  return (
    <>
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)} />
      <PasteModal   isOpen={isPasteOpen}   onClose={() => setPasteOpen(false)} />
      <CopyModal    isOpen={isCopyOpen}     onClose={() => setCopyOpen(false)} />
      <AiResultModal isOpen={isAiOpen}     onClose={() => setAiOpen(false)} />
    </>
  );
};

export default Modals;
