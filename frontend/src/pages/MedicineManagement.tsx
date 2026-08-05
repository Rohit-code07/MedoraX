import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Medicine } from '../types';
import { 
  Grid, 
  List, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Archive, 
  Trash2, 
  Heart, 
  Sparkles, 
  HelpCircle,
  Clock,
  ChevronDown,
  Plus,
  AlertTriangle,
  FolderOpen,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import toast from 'react-hot-toast';

export const MedicineManagement: React.FC = () => {
  const navigate = useNavigate();
  const { medicines, deleteMedicine, archiveMedicine, updateMedicine } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived' | 'completed'>('all');
  const [freqFilter, setFreqFilter] = useState<'all' | 'daily' | 'weekly' | 'as_needed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  // Modal control states
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);

  // Filtered & Sorted medicines list
  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((med) => {
        const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              med.notes?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || med.status === statusFilter;
        
        const matchesFreq = freqFilter === 'all' || med.frequency === freqFilter;

        return matchesSearch && matchesStatus && matchesFreq;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          // Sort by ID as proxy for date added (newer first)
          return b.id.localeCompare(a.id);
        }
      });
  }, [medicines, searchQuery, statusFilter, freqFilter, sortBy]);

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMedicine(deleteTarget.id);
      toast.success(`${deleteTarget.name} has been removed from database.`);
      setDeleteTarget(null);
    }
  };

  const handleArchiveToggle = (med: Medicine) => {
    archiveMedicine(med.id);
    toast.success(
      med.status === 'archived' 
        ? `${med.name} is now restored to active shelf.` 
        : `${med.name} has been archived.`
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      updateMedicine(editTarget);
      toast.success(`${editTarget.name} updated successfully!`);
      setEditTarget(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tablet':
      case 'capsule':
        return <Heart className="w-4 h-4 text-blue-500 fill-blue-500/10" />;
      case 'liquid':
        return <Activity className="w-4 h-4 text-teal-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* 1. Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Medication Catalog</span>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-1">Manage Medicine Shelf</h2>
        </div>
        <Button 
          onClick={() => navigate('/add-medicine')} 
          size="md"
          className="rounded-xl px-4 text-xs font-semibold cursor-pointer"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Medication
        </Button>
      </div>

      {/* 2. Filters & Options toolbar */}
      <Card className="border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-[#121214]">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, chemical, compound..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none text-slate-700 dark:text-zinc-200 placeholder:text-slate-400 focus:border-brand-primary dark:focus:border-brand-secondary transition-all"
            />
          </div>

          {/* Filtering Dropdowns & toggles */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Select */}
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 text-slate-600 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Shelf</option>
              <option value="archived">Archived Shelf</option>
              <option value="completed">Completed History</option>
            </select>

            {/* Schedule Select */}
            <select
              value={freqFilter}
              onChange={(e: any) => setFreqFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 text-slate-600 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily Schedule</option>
              <option value="weekly">Weekly Schedule</option>
              <option value="as_needed">As Needed (PRN)</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-150 dark:border-zinc-850 text-slate-600 dark:text-zinc-300 outline-none cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date Added</option>
            </select>

            {/* View Mode Switcher */}
            <div className="h-9 p-0.5 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center border border-slate-150 dark:border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* 3. Empty State display */}
      {filteredMedicines.length === 0 && (
        <div className="p-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-[24px] text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-center text-slate-300 dark:text-zinc-700 mb-4">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No medications match search criteria</h3>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 max-w-sm leading-normal">
            Refine your query settings or add a new drug setup on your active shelf.
          </p>
        </div>
      )}

      {/* 4. Grid view mode */}
      {viewMode === 'grid' && filteredMedicines.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((med) => (
            <Card key={med.id} hoverable className="bg-white dark:bg-[#121214] border-slate-100 dark:border-zinc-800/40 relative">
              
              {/* Category indicator icon top right */}
              <div className="absolute top-4 right-4 flex gap-1.5 select-none">
                <Badge variant={med.status === 'active' ? 'primary' : med.status === 'completed' ? 'success' : 'neutral'} size="sm">
                  {med.status}
                </Badge>
              </div>

              <CardContent className="p-6 flex flex-col justify-between h-full gap-5">
                
                {/* General data */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0">
                    {getCategoryIcon(med.category)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {med.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5">
                      {med.dosage} • {med.category}
                    </span>
                  </div>
                </div>

                {/* Timing logs metadata */}
                <div className="p-3 bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-50 dark:border-zinc-800/40 rounded-xl flex flex-col gap-2 select-none">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Dosing Alert: {med.times.join(', ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500">
                    <span>Freq: {med.frequency.replace('_', ' ')}</span>
                    {med.foodTiming !== 'none' && <span>Take {med.foodTiming} meals</span>}
                  </div>
                </div>

                {med.notes && (
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-normal line-clamp-2">
                    {med.notes}
                  </p>
                )}

                {/* Actions row */}
                <div className="flex justify-between items-center border-t border-slate-50 dark:border-zinc-800/50 pt-4">
                  <div className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                    Start: {med.startDate}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditTarget(med)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                      title="Edit medicine"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleArchiveToggle(med)}
                      className={`p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${med.status === 'archived' ? 'text-amber-500' : 'text-slate-400'}`}
                      title={med.status === 'archived' ? 'Restore shelf' : 'Archive medicine'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(med)}
                      className="p-2 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                      title="Delete medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 5. Table view mode */}
      {viewMode === 'table' && filteredMedicines.length > 0 && (
        <Card className="border-slate-150 dark:border-zinc-800 bg-white dark:bg-[#121214] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-150 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  <th className="p-4">Medication</th>
                  <th className="p-4">Dosage</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Food Constraints</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/50">
                {filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors text-xs text-slate-700 dark:text-zinc-300">
                    <td className="p-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        {getCategoryIcon(med.category)}
                      </div>
                      <div className="flex flex-col">
                        <span>{med.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal mt-0.5">{med.category}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{med.dosage}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{med.times.join(', ')}</span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">{med.frequency}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      {med.foodTiming === 'none' ? 'None' : `${med.foodTiming} meals`}
                    </td>
                    <td className="p-4">
                      <Badge variant={med.status === 'active' ? 'primary' : med.status === 'completed' ? 'success' : 'neutral'} size="sm">
                        {med.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditTarget(med)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleArchiveToggle(med)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-500 cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(med)}
                          className="p-1.5 rounded-lg bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 6. Edit Medicine modal popup */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Medication Details"
        description="Modify dosage configurations, times, or administration constraints."
      >
        {editTarget && (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 text-left">
            <Input
              label="Medicine Name"
              value={editTarget.name}
              onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dosage Amount"
                value={editTarget.dosage}
                onChange={(e) => setEditTarget({ ...editTarget, dosage: e.target.value })}
                required
              />
              <Select
                label="Category Type"
                options={[
                  { value: 'tablet', label: 'Tablet' },
                  { value: 'capsule', label: 'Capsule' },
                  { value: 'liquid', label: 'Liquid / Oral Solution' },
                  { value: 'injection', label: 'Injection' },
                  { value: 'inhaler', label: 'Inhaler / Spray' },
                  { value: 'other', label: 'Other' },
                ]}
                value={editTarget.category}
                onChange={(e: any) => setEditTarget({ ...editTarget, category: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Frequency Recurrence"
                options={[
                  { value: 'daily', label: 'Daily Scheduled' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'as_needed', label: 'As Needed (PRN)' },
                ]}
                value={editTarget.frequency}
                onChange={(e: any) => setEditTarget({ ...editTarget, frequency: e.target.value })}
              />
              <Select
                label="Food Timing Constraint"
                options={[
                  { value: 'none', label: 'No Constraint' },
                  { value: 'before', label: 'Before Meals' },
                  { value: 'with', label: 'With Meals' },
                  { value: 'after', label: 'After Meals' },
                ]}
                value={editTarget.foodTiming}
                onChange={(e: any) => setEditTarget({ ...editTarget, foodTiming: e.target.value })}
              />
            </div>

            <Input
              label="Intake Times (comma-separated, 24h format)"
              value={editTarget.times.join(', ')}
              onChange={(e) => setEditTarget({ ...editTarget, times: e.target.value.split(',').map(t => t.trim()) })}
              helperText="E.g. 08:00, 20:00"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Administration Notes</label>
              <textarea
                value={editTarget.notes}
                onChange={(e) => setEditTarget({ ...editTarget, notes: e.target.value })}
                className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl outline-none text-slate-800 dark:text-zinc-200 focus:border-brand-primary"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-50 dark:border-zinc-800/50 pt-4 mt-2">
              <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* 7. Confirm Delete modal popup */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
        description="Are you absolutely sure you want to delete this medication?"
      >
        {deleteTarget && (
          <div className="text-left flex flex-col gap-4">
            <div className="p-4 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10 flex gap-3 items-start select-none">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col text-xs gap-1 leading-normal">
                <span className="font-bold">Dangerous Action warning</span>
                <p>Deleting "{deleteTarget.name}" will permanently clear all scheduling alerts and historical dosing logs associated with it from local database. This cannot be undone.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2 border-t border-slate-50 dark:border-zinc-800/50 pt-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Medication
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
export default MedicineManagement;
