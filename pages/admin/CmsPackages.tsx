import React, { useEffect, useState } from 'react';
import { cmsPackages, CmsPackage } from '../../services/cms';
import {
    Plus, Trash2, Save, RefreshCw, Edit3, X,
    CheckCircle2, AlertCircle, Loader2, Package, Star, ToggleLeft, ToggleRight
} from 'lucide-react';

const ICON_OPTIONS = ['Camera', 'Star', 'Gem', 'Video', 'Aperture', 'Heart', 'Sparkles', 'Award', 'Crown', 'Shield'];

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-xl animate-fade-in-up ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span className="text-sm font-medium">{message}</span>
    </div>
);

type EditablePkg = Omit<CmsPackage, 'id'> & { id?: number };

const EMPTY_PKG: EditablePkg = {
    tier_id: '',
    name: '',
    subtitle: '',
    price: 'Contact for Quote',
    description: '',
    detailed_description: '',
    ideal_for: '',
    features: [''],
    is_popular: false,
    icon_name: 'Camera',
    sort_order: 99,
    is_active: true,
};

const FeatureListEditor = ({
    features, onChange,
}: { features: string[]; onChange: (f: string[]) => void }) => {
    const update = (i: number, val: string) => { const arr = [...features]; arr[i] = val; onChange(arr); };
    const add = () => onChange([...features, '']);
    const remove = (i: number) => onChange(features.filter((_, idx) => idx !== i));
    return (
        <div className="space-y-2">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        value={f}
                        onChange={e => update(i, e.target.value)}
                        placeholder={`Feature ${i + 1}`}
                        className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                    <button onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <X size={14} />
                    </button>
                </div>
            ))}
            <button onClick={add} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400 transition-all text-sm w-full justify-center">
                <Plus size={14} /> Add Feature
            </button>
        </div>
    );
};

const CmsPackages: React.FC = () => {
    const [packages, setPackages] = useState<CmsPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [editing, setEditing] = useState<EditablePkg | null>(null);
    const [isNew, setIsNew] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        const data = await cmsPackages.getAllAdmin();
        setPackages(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleEdit = (pkg: CmsPackage) => {
        setEditing({ ...pkg });
        setIsNew(false);
    };

    const handleNew = () => {
        setEditing({ ...EMPTY_PKG, sort_order: packages.length + 1 });
        setIsNew(true);
    };

    const handleSave = async () => {
        if (!editing) return;
        if (!editing.name.trim() || !editing.tier_id.trim()) {
            showToast('Package name and Tier ID are required.', 'error'); return;
        }
        setSaving(true);

        const payload: Omit<CmsPackage, 'id'> = {
            tier_id: editing.tier_id.trim().toLowerCase().replace(/\s+/g, '-'),
            name: editing.name.trim(),
            subtitle: editing.subtitle.trim(),
            price: editing.price.trim(),
            description: editing.description.trim(),
            detailed_description: editing.detailed_description.trim(),
            ideal_for: editing.ideal_for.trim(),
            features: editing.features.filter(f => f.trim()),
            is_popular: editing.is_popular,
            icon_name: editing.icon_name,
            sort_order: editing.sort_order,
            is_active: editing.is_active,
        };

        let ok: boolean;
        if (isNew) {
            ok = await cmsPackages.upsert(payload);
        } else {
            ok = editing.id ? await cmsPackages.update(editing.id, payload) : false;
        }

        if (ok) {
            showToast('Package saved!');
            setEditing(null);
            load();
        } else {
            showToast('Save failed. Check Supabase connection.', 'error');
        }
        setSaving(false);
    };

    const handleDelete = async (pkg: CmsPackage) => {
        if (!window.confirm(`Delete "${pkg.name}" package?`)) return;
        const ok = await cmsPackages.remove(pkg.id);
        if (ok) { showToast('Package deleted.'); setPackages(prev => prev.filter(p => p.id !== pkg.id)); }
        else showToast('Delete failed.', 'error');
    };

    const handleToggleActive = async (pkg: CmsPackage) => {
        await cmsPackages.update(pkg.id, { is_active: !pkg.is_active });
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, is_active: !p.is_active } : p));
        showToast(`Package ${pkg.is_active ? 'hidden' : 'published'} on site.`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {toast && <Toast {...toast} />}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Packages CMS</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Edit pricing packages shown on your website.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all">
                        <Plus size={16} /> New Package
                    </button>
                </div>
            </div>

            {/* Package Cards */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {packages.map(pkg => (
                        <div key={pkg.id} className={`bg-white dark:bg-zinc-900/40 border rounded-2xl p-5 space-y-4 transition-all ${pkg.is_active ? 'border-gray-200 dark:border-white/10' : 'border-red-200 dark:border-red-500/20 opacity-60'}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                            {pkg.tier_id}
                                        </span>
                                        {pkg.is_popular && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{pkg.subtitle}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleToggleActive(pkg)} title="Toggle visibility" className="p-2 text-gray-400 dark:text-gray-500 hover:text-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">
                                        {pkg.is_active ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} />}
                                    </button>
                                    <button onClick={() => handleEdit(pkg)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(pkg)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{pkg.price || <em className="text-gray-400">No price set</em>}</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{pkg.description}</p>

                            <div className="space-y-1">
                                {pkg.features.slice(0, 4).map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                        {f}
                                    </div>
                                ))}
                                {pkg.features.length > 4 && <p className="text-xs text-gray-400 pl-3.5">+{pkg.features.length - 4} more</p>}
                            </div>
                        </div>
                    ))}

                    {packages.length === 0 && (
                        <div className="md:col-span-3 py-24 text-center bg-white dark:bg-zinc-900/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                            <Package size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                            <h3 className="text-gray-900 dark:text-white font-semibold">No packages yet</h3>
                            <p className="text-gray-500 text-sm mt-1">Create your first pricing package.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Drawer */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-start justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)} />
                    <div className="relative w-full max-w-xl h-full bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-white/10 overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {isNew ? 'New Package' : `Edit: ${editing.name}`}
                            </h3>
                            <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {[
                                { label: 'Package Name *', key: 'name', placeholder: 'GOLD' },
                                { label: 'Tier ID *', key: 'tier_id', placeholder: 'tier-gold' },
                                { label: 'Subtitle', key: 'subtitle', placeholder: 'Signature Cinematic' },
                                { label: 'Price', key: 'price', placeholder: 'Contact for Quote or ₹XX,XXX' },
                                { label: 'Ideal For', key: 'ideal_for', placeholder: 'Weddings, corporate events...' },
                            ].map(field => (
                                <div key={field.key}>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        value={(editing as any)[field.key]}
                                        onChange={e => setEditing(prev => prev ? { ...prev, [field.key]: e.target.value } : null)}
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Short Description</label>
                                <textarea
                                    rows={2}
                                    placeholder="A short tag line for this package..."
                                    value={editing.description}
                                    onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : null)}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Detailed Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Shown when the user clicks to learn more..."
                                    value={editing.detailed_description}
                                    onChange={e => setEditing(prev => prev ? { ...prev, detailed_description: e.target.value } : null)}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {ICON_OPTIONS.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setEditing(prev => prev ? { ...prev, icon_name: icon } : null)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${editing.icon_name === icon ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-emerald-400'}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editing.is_popular}
                                        onChange={e => setEditing(prev => prev ? { ...prev, is_popular: e.target.checked } : null)}
                                        className="w-4 h-4 rounded accent-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Mark as Popular</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editing.is_active}
                                        onChange={e => setEditing(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                                        className="w-4 h-4 rounded accent-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Active (visible)</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Features List</label>
                                <FeatureListEditor
                                    features={editing.features}
                                    onChange={f => setEditing(prev => prev ? { ...prev, features: f } : null)}
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                                <button
                                    onClick={() => setEditing(null)}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Package'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CmsPackages;
