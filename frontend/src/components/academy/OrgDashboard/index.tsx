import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamLearner {
  id: string;
  name: string;
  role: string;
  modulesCompleted: number;
  quizAverage: number;
}

const OrgDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [learners, setLearners] = useState<TeamLearner[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [modules, setModules] = useState('0');
  const [average, setAverage] = useState('0');
  const [notice, setNotice] = useState('');

  const averageScore = useMemo(() => learners.length
    ? Math.round(learners.reduce((sum, item) => sum + item.quizAverage, 0) / learners.length)
    : 0, [learners]);

  const addLearner = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setLearners((current) => [...current, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      role: role.trim() || 'Learner',
      modulesCompleted: Math.max(0, Number(modules) || 0),
      quizAverage: Math.min(100, Math.max(0, Number(average) || 0)),
    }]);
    setName('');
    setRole('');
    setModules('0');
    setAverage('0');
    setNotice('Learner added to this local team tracker.');
  };

  const exportCsv = () => {
    if (!learners.length) {
      setNotice('Add learner records before exporting a report.');
      return;
    }
    const rows = [
      ['Name', 'Role / Department', 'Modules completed', 'Quiz average (%)'],
      ...learners.map((item) => [item.name, item.role, String(item.modulesCompleted), String(item.quizAverage)]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'heartcode-academy-team-progress.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Team progress CSV exported.');
  };

  return (
    <div className="academy-section flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <button className="academy-back-btn m-0" onClick={() => navigate('/academy')}>← Back to Academy</button>
        <button onClick={exportCsv} className="bg-cyber-surface2 border border-cyber-border hover:border-cyber-red text-cyber-ash px-4 py-2 rounded text-xs cursor-pointer">Export CSV</button>
      </div>
      <div className="academy-section-header">
        <h2 className="academy-section-title">Organisation learning tracker</h2>
        <p className="academy-section-desc">Add your own learner records, review training progress and export a simple report. This version stores entries in this browser only; it is not a live multi-user HR system.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-cyber-surface border border-cyber-border rounded p-4"><div className="text-cyber-ash2 text-xs">Learners recorded</div><strong className="block text-2xl text-white mt-1">{learners.length}</strong></div>
        <div className="bg-cyber-surface border border-cyber-border rounded p-4"><div className="text-cyber-ash2 text-xs">Average quiz score</div><strong className="block text-2xl text-white mt-1">{averageScore}%</strong></div>
        <div className="bg-cyber-surface border border-cyber-border rounded p-4"><div className="text-cyber-ash2 text-xs">Modules completed</div><strong className="block text-2xl text-white mt-1">{learners.reduce((sum, item) => sum + item.modulesCompleted, 0)}</strong></div>
      </div>
      <form onSubmit={addLearner} className="bg-cyber-surface border border-cyber-border rounded p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <label className="text-xs text-cyber-ash2 flex flex-col gap-1">Learner name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ada Okon" className="bg-cyber-bg border border-cyber-border rounded p-2 text-white text-sm" /></label>
        <label className="text-xs text-cyber-ash2 flex flex-col gap-1">Role / department<input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Student" className="bg-cyber-bg border border-cyber-border rounded p-2 text-white text-sm" /></label>
        <label className="text-xs text-cyber-ash2 flex flex-col gap-1">Modules completed<input type="number" min="0" value={modules} onChange={(e) => setModules(e.target.value)} className="bg-cyber-bg border border-cyber-border rounded p-2 text-white text-sm" /></label>
        <label className="text-xs text-cyber-ash2 flex flex-col gap-1">Quiz average (%)<input type="number" min="0" max="100" value={average} onChange={(e) => setAverage(e.target.value)} className="bg-cyber-bg border border-cyber-border rounded p-2 text-white text-sm" /></label>
        <button type="submit" className="bg-cyber-red hover:bg-cyber-red-hi text-white rounded p-2.5 text-xs font-semibold">Add learner</button>
      </form>
      {notice && <p role="status" className="text-xs text-cyber-ash">{notice}</p>}
      <div className="bg-cyber-surface border border-cyber-border rounded overflow-hidden">
        <div className="p-4 border-b border-cyber-border flex items-center justify-between"><h3 className="text-sm font-semibold text-white">Learner progress</h3><span className="text-xs text-cyber-ash2">{learners.length} records</span></div>
        {learners.length ? <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-cyber-ash2 bg-cyber-bg"><tr><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Modules</th><th className="p-3">Quiz average</th><th className="p-3">Learning status</th><th className="p-3"></th></tr></thead><tbody className="divide-y divide-cyber-border">{learners.map((item) => <tr key={item.id}><td className="p-3 text-white">{item.name}</td><td className="p-3 text-cyber-ash">{item.role}</td><td className="p-3">{item.modulesCompleted}</td><td className="p-3">{item.quizAverage}%</td><td className="p-3"><span className={item.quizAverage >= 70 ? 'text-cyber-green' : 'text-cyber-amber'}>{item.quizAverage >= 70 ? 'On track' : 'Needs support'}</span></td><td className="p-3"><button onClick={() => setLearners((current) => current.filter((row) => row.id !== item.id))} className="text-cyber-ash2 hover:text-cyber-red">Remove</button></td></tr>)}</tbody></table></div> : <div className="p-10 text-center"><p className="text-white text-sm">No learner records yet</p><p className="text-cyber-ash2 text-xs mt-2">Add a learner above to start tracking your class or team.</p></div>}
      </div>
    </div>
  );
};

export default OrgDashboard;
