import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../services/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Search,
    Download,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Calendar,
    Phone,
    Users,
    MessageSquare,
    Clock,
    Filter,
    UserPlus,
    Zap,
    FileSpreadsheet,
    FileText
} from 'lucide-react';

interface UserDetail {
    id: number;
    name: string;
    whatsapp_number: string;
    created_at: string;
}

const ITEMS_PER_PAGE = 8;

const Dashboard: React.FC = () => {
    const [data, setData] = useState<UserDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortAsc, setSortAsc] = useState(false); // Default latest first
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [metrics, setMetrics] = useState({ total: 0, newToday: 0 });

    const fetchMetrics = async () => {
        if (!supabase) return;
        const { count: total } = await supabase.from('user_details').select('*', { count: 'exact', head: true });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: newToday } = await supabase.from('user_details')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString());

        setMetrics({ total: total || 0, newToday: newToday || 0 });
    };

    const fetchUsers = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            let query = supabase.from('user_details').select('*', { count: 'exact' });

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,whatsapp_number.ilike.%${searchQuery}%`);
            }

            // Apply Date Filter
            const now = new Date();
            if (dateFilter === 'today') {
                const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                query = query.gte('created_at', startOfDay);
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
                query = query.gte('created_at', weekAgo);
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
                query = query.gte('created_at', monthAgo);
            }

            query = query.order('created_at', { ascending: sortAsc });

            const from = (page - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data: users, error, count } = await query.range(from, to);
            if (error) throw error;

            setData(users || []);
            setTotalCount(count || 0);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, sortAsc, dateFilter]);

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchUsers(), 300);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this submission?')) return;
        if (!supabase) return;
        try {
            const { error } = await supabase.from('user_details').delete().eq('id', id);
            if (error) throw error;
            fetchUsers();
            fetchMetrics();
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const getFilteredQuery = () => {
        if (!supabase) return null;
        let query = supabase.from('user_details').select('*').order('created_at', { ascending: sortAsc });

        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%,whatsapp_number.ilike.%${searchQuery}%`);
        }

        const now = new Date();
        if (dateFilter === 'today') {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0)).toISOString();
            query = query.gte('created_at', startOfDay);
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
            query = query.gte('created_at', weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
            query = query.gte('created_at', monthAgo);
        }

        return query;
    };

    const handleExportExcel = async () => {
        const query = getFilteredQuery();
        if (!query) return;

        try {
            const { data: allData, error } = await query;
            if (error) throw error;
            if (!allData || allData.length === 0) return alert('No data to export');

            const exportData = allData.map(row => ({
                ID: row.id,
                Name: row.name,
                Phone: row.whatsapp_number,
                'Date Created': new Date(row.created_at).toLocaleString(),
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Leads');
            XLSX.writeFile(wb, `Leads_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
            setIsExportOpen(false);
        } catch (err) {
            console.error('Excel export failed:', err);
            alert('Failed to export Excel');
        }
    };

    const handleExportPDF = async () => {
        const query = getFilteredQuery();
        if (!query) return;

        try {
            const { data: allData, error } = await query;
            if (error) throw error;
            if (!allData || allData.length === 0) return alert('No data to export');

            const doc = new jsPDF();

            // Title
            doc.setFontSize(18);
            doc.setTextColor(0, 150, 136); // Emeraldish color
            doc.text('SkyCam Leads Report', 14, 22);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            const tableColumn = ["ID", "Name", "Phone", "Date Created"];
            const tableRows = allData.map(row => [
                row.id,
                row.name,
                row.whatsapp_number,
                new Date(row.created_at).toLocaleString()
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [16, 185, 129] } // Emerald-500
            });

            doc.save(`Leads_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            setIsExportOpen(false);
        } catch (err) {
            console.error('PDF export failed:', err);
            alert('Failed to export PDF');
        }
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your lead submissions and analytics.</p>
                </div>
                <div className="text-sm text-gray-500 font-mono bg-white dark:bg-zinc-900/50 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Card */}
                <div className="relative overflow-hidden group rounded-3xl bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-white/5 p-6 hover:shadow-lg dark:hover:bg-zinc-900/60 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity text-indigo-600 dark:text-white">
                        <UserPlus size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                <UserPlus size={20} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Leads</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{metrics.total}</h3>
                            <span className="text-sm text-gray-500">submissions</span>
                        </div>
                    </div>
                </div>

                {/* New Today Card */}
                <div className="relative overflow-hidden group rounded-3xl bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-white/5 p-6 hover:shadow-lg dark:hover:bg-zinc-900/60 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity text-emerald-600 dark:text-white">
                        <Zap size={80} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2.5 rounded-xl border ${metrics.newToday > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-gray-50 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-500/20'}`}>
                                <Zap size={20} />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Today</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">{metrics.newToday}</h3>
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${metrics.newToday > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                {metrics.newToday > 0 ? '+ increased' : '---'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table Section */}
            <div className="bg-white dark:bg-zinc-900/30 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
                {/* Checkpoint Toolbar */}
                <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-transparent">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm dark:shadow-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto relative">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all w-full md:w-auto justify-center ${dateFilter !== 'all' || isFilterOpen
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                    : 'bg-white dark:bg-black/40 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 shadow-sm dark:shadow-none'
                                    }`}
                            >
                                <Filter size={16} />
                                {dateFilter === 'all' ? 'Filter' : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                            </button>

                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-fade-in-up">
                                    <div className="p-2 space-y-1">
                                        {[
                                            { id: 'all', label: 'All Time', icon: Calendar, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-400/10' },
                                            { id: 'today', label: 'Today', icon: Clock, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-400/10' },
                                            { id: 'week', label: 'Last 7 Days', icon: Calendar, color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-400/10' },
                                            { id: 'month', label: 'Last 30 Days', icon: Calendar, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-400/10' },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setDateFilter(option.id as any);
                                                    setIsFilterOpen(false);
                                                    setPage(1);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${dateFilter === option.id
                                                    ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                <div className={`p-1.5 rounded-md ${option.bg} ${option.color}`}>
                                                    <option.icon size={14} />
                                                </div>
                                                {option.label}
                                                {dateFilter === option.id && (
                                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 box-shadow-glow"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSortAsc(!sortAsc)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full md:w-auto justify-center shadow-sm dark:shadow-none"
                        >
                            <ArrowUpDown size={16} />
                            {sortAsc ? 'Oldest' : 'Newest'}
                        </button>
                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsExportOpen(!isExportOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 transition-all w-full md:w-auto justify-center"
                            >
                                <Download size={16} />
                                Export
                            </button>

                            {isExportOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-fade-in-up">
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={handleExportExcel}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                                        >
                                            <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                <FileSpreadsheet size={14} />
                                            </div>
                                            Export Excel
                                        </button>
                                        <button
                                            onClick={handleExportPDF}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                                                <FileText size={14} />
                                            </div>
                                            Export PDF
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/5 text-left border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">#</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submission Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                                        <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="mx-auto h-12 w-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 mb-3">
                                            <MessageSquare size={24} />
                                        </div>
                                        <h3 className="text-gray-900 dark:text-white font-medium">No leads found</h3>
                                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                data.map((user, index) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-500 font-mono">
                                            {((page - 1) * ITEMS_PER_PAGE) + index + 1}
                                        </td>
                                        <td className="px-6 py-4 border-l-2 border-transparent hover:border-emerald-500 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-white dark:ring-transparent">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">{user.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Phone size={14} className="text-emerald-600 dark:text-emerald-500" />
                                                <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors">{user.whatsapp_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-600">
                                                    {new Date(user.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Matching the specific design style */}
                {totalCount > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            Showing <span className="text-gray-900 dark:text-white font-medium">{((page - 1) * ITEMS_PER_PAGE) + 1}</span> - <span className="text-gray-900 dark:text-white font-medium">{Math.min(page * ITEMS_PER_PAGE, totalCount)}</span> of <span className="text-gray-900 dark:text-white font-medium">{totalCount}</span>
                        </p>

                        <div className="flex rounded-lg bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 p-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-md hover:bg-white dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm dark:shadow-none"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center px-4 font-mono text-sm text-gray-600 dark:text-gray-300">
                                {page} <span className="text-gray-400 dark:text-gray-600 mx-2">/</span> {totalPages}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-md hover:bg-white dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-sm dark:shadow-none"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
