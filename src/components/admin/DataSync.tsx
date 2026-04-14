import React, { useState } from 'react';
import Papa from 'papaparse';
import { Download, Upload, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { dataService } from '../../services/data.service';

interface LogEntry {
  id: string;
  timestamp: Date;
  action: 'EXPORT' | 'IMPORT';
  table: string;
  status: 'SUCCESS' | 'ERROR';
  message: string;
}

export const DataSync: React.FC = () => {
  const [daysOld, setDaysOld] = useState<number>(30);
  const [selectedTable, setSelectedTable] = useState<string>('orders');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const tables = ['orders', 'tasks', 'locations', 'interactions'];

  const addLog = (action: 'EXPORT' | 'IMPORT', table: string, status: 'SUCCESS' | 'ERROR', message: string) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      action,
      table,
      status,
      message
    }, ...prev]);
  };

  const handleExportAndArchive = async () => {
    if (!window.confirm(`Are you sure you want to export and archive ${selectedTable} older than ${daysOld} days? This will remove them from the active database.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Fetch old records
      const records = await dataService.getOldRecords(selectedTable, daysOld);
      
      if (!records || records.length === 0) {
        addLog('EXPORT', selectedTable, 'SUCCESS', `No records found older than ${daysOld} days.`);
        setIsProcessing(false);
        return;
      }

      // 2. Convert to CSV
      const csv = Papa.unparse(records);
      
      // 3. Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedTable}_archive_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 4. Delete from Supabase (Archiving)
      const idsToDelete = records.map(r => r.id);
      await dataService.deleteRecords(selectedTable, idsToDelete);

      addLog('EXPORT', selectedTable, 'SUCCESS', `Successfully exported and archived ${records.length} records.`);
    } catch (error: any) {
      console.error('Export error:', error);
      addLog('EXPORT', selectedTable, 'ERROR', error.message || 'Failed to export records.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Are you sure you want to import data into the ${selectedTable} table? This may overwrite existing data if IDs match.`)) {
      e.target.value = ''; // Reset file input
      return;
    }

    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const records = results.data;
          if (records.length === 0) {
            addLog('IMPORT', selectedTable, 'ERROR', 'The CSV file is empty.');
            return;
          }

          await dataService.insertRecords(selectedTable, records);
          addLog('IMPORT', selectedTable, 'SUCCESS', `Successfully imported ${records.length} records.`);
        } catch (error: any) {
          console.error('Import error:', error);
          addLog('IMPORT', selectedTable, 'ERROR', error.message || 'Failed to import records.');
        } finally {
          setIsProcessing(false);
          e.target.value = ''; // Reset file input
        }
      },
      error: (error) => {
        addLog('IMPORT', selectedTable, 'ERROR', `CSV Parse Error: ${error.message}`);
        setIsProcessing(false);
        e.target.value = '';
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Database size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Data Synchronization & Archiving</h2>
          <p className="text-sm text-slate-500">Export old records to CSV or restore from backups</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Table</label>
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            >
              {tables.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Download size={16} className="text-slate-500" /> Export & Archive
            </h3>
            <p className="text-xs text-slate-500">
              Compress and download records older than the specified days. These records will be removed from the active database to save space.
            </p>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                value={daysOld}
                onChange={(e) => setDaysOld(parseInt(e.target.value) || 0)}
                className="w-24 p-2 bg-white border border-slate-200 rounded-lg text-sm text-center"
                min="1"
              />
              <span className="text-sm text-slate-600 font-medium">days old</span>
            </div>
            <button 
              onClick={handleExportAndArchive}
              disabled={isProcessing}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Export & Archive to CSV'}
            </button>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Upload size={16} className="text-slate-500" /> Restore / Import
            </h3>
            <p className="text-xs text-slate-500">
              Restore previously archived records from a CSV file back into the active database.
            </p>
            <div className="relative">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleImport}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <button 
                disabled={isProcessing}
                className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Upload size={16} /> {isProcessing ? 'Processing...' : 'Select CSV to Import'}
              </button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-slate-900 rounded-2xl p-5 flex flex-col h-[400px]">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            Terminal Logs
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-sm font-mono">No recent activity...</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="text-xs font-mono border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500">[{log.timestamp.toLocaleTimeString()}]</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.action === 'EXPORT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {log.action}
                    </span>
                    <span className="text-slate-300">{log.table}</span>
                  </div>
                  <div className={`flex items-start gap-1.5 ${log.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.status === 'SUCCESS' ? <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                    <span className="break-words">{log.message}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
