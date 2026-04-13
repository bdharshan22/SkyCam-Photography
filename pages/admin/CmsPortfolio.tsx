import React, { useEffect, useState, useRef } from 'react';
import { cmsPhotos, CmsPhoto } from '../../services/cms';
import {
    Upload, Trash2, Eye, EyeOff, Plus, RefreshCw,
    Image, Tag, AlertCircle, CheckCircle2, Loader2, GripVertical, ExternalLink
} from 'lucide-react';

const CATEGORIES = ['wedding', 'portrait', 'baby', 'maternity', 'couple', 'event', 'drone', 'product'];

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) => {
    const colors = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        error: 'bg-red-500/10 border-red-500/30 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    };
    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl shadow-xl animate-fade-in-up ${colors[type]}`}>
            {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};

interface AddPhotoForm {
    url: string;
    category: string;
    title: string;
    description: string;
}

const DEFAULT_FORM: AddPhotoForm = { url: '', category: 'wedding', title: '', description: '' };

const CmsPortfolio: React.FC = () => {
    const [photos, setPhotos] = useState<CmsPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState<AddPhotoForm>(DEFAULT_FORM);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [filterCat, setFilterCat] = useState<string>('all');
    const fileRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const load = async () => {
        setLoading(true);
        const data = await cmsPhotos.getAllAdmin();
        setPhotos(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
        reader.readAsDataURL(file);
        setForm(prev => ({ ...prev, url: '' })); // clear manual URL when file chosen
    };

    const handleAdd = async () => {
        if (!form.title.trim() || (!form.url.trim() && !uploadFile)) {
            showToast('Title and image (URL or upload) are required.', 'error'); return;
        }
        setSaving(true);
        let imageUrl = form.url.trim();

        if (uploadFile) {
            showToast('Uploading image...', 'info');
            const uploaded = await cmsPhotos.uploadImage(uploadFile);
            if (!uploaded) {
                showToast('Upload failed. Check Supabase Storage bucket "cms-assets".', 'error');
                setSaving(false); return;
            }
            imageUrl = uploaded;
        }

        const newPhoto = await cmsPhotos.insert({
            url: imageUrl,
            category: form.category,
            title: form.title.trim(),
            description: form.description.trim(),
            sort_order: photos.length + 1,
            is_active: true,
        });

        if (newPhoto) {
            showToast('Photo added successfully!', 'success');
            setForm(DEFAULT_FORM);
            setUploadFile(null);
            setPreviewUrl('');
            setShowAddForm(false);
            load();
        } else {
            showToast('Failed to add photo.', 'error');
        }
        setSaving(false);
    };

    const handleToggle = async (photo: CmsPhoto) => {
        await cmsPhotos.update(photo.id, { is_active: !photo.is_active });
        showToast(`Photo ${photo.is_active ? 'hidden' : 'shown'} on site.`);
        setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, is_active: !p.is_active } : p));
    };

    const handleDelete = async (photo: CmsPhoto) => {
        if (!window.confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;
        const ok = await cmsPhotos.remove(photo.id);
        if (ok) { showToast('Photo deleted.'); setPhotos(prev => prev.filter(p => p.id !== photo.id)); }
        else showToast('Delete failed.', 'error');
    };

    const displayed = filterCat === 'all' ? photos : photos.filter(p => p.category === filterCat);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {toast && <Toast {...toast} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Portfolio CMS</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage gallery photos without touching code.{' '}
                        <span className="text-emerald-500 font-medium">{photos.filter(p => p.is_active).length} active</span>
                        {' '}/ {photos.length} total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={load}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        <Plus size={16} /> Add Photo
                    </button>
                </div>
            </div>

            {/* Add Photo Panel */}
            {showAddForm && (
                <div className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-white/10 rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Image size={20} className="text-emerald-500" /> Add New Photo
                    </h3>

                    {/* Upload or URL */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors group relative overflow-hidden"
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="preview" className="h-32 object-cover rounded-lg mx-auto" />
                                    <p className="text-xs text-gray-500 mt-2">{uploadFile?.name}</p>
                                </>
                            ) : (
                                <>
                                    <Upload size={28} className="mx-auto text-gray-400 dark:text-gray-600 group-hover:text-emerald-500 transition-colors mb-2" />
                                    <p className="text-sm text-gray-500">Drop or click to upload</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG / PNG / WEBP</p>
                                </>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Or paste image URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={form.url}
                                    onChange={e => { setForm(prev => ({ ...prev, url: e.target.value })); setUploadFile(null); setPreviewUrl(''); }}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title *</label>
                            <input
                                type="text"
                                placeholder="Sacred Vows"
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</label>
                            <input
                                type="text"
                                placeholder="A brief caption..."
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => { setShowAddForm(false); setForm(DEFAULT_FORM); setUploadFile(null); setPreviewUrl(''); }}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-60"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            {saving ? 'Saving...' : 'Save Photo'}
                        </button>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {['all', ...CATEGORIES].map(c => (
                    <button
                        key={c}
                        onClick={() => setFilterCat(c)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                            filterCat === c
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {c === 'all' ? 'All' : c}
                        {c !== 'all' && (
                            <span className="ml-1.5 opacity-60">{photos.filter(p => p.category === c).length}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Photo Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                </div>
            ) : displayed.length === 0 ? (
                <div className="py-24 text-center bg-white dark:bg-zinc-900/30 border border-gray-200 dark:border-white/5 rounded-2xl">
                    <Image size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <h3 className="text-gray-900 dark:text-white font-semibold">No photos yet</h3>
                    <p className="text-gray-500 text-sm mt-1">Click "Add Photo" to upload your first portfolio image.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayed.map(photo => (
                        <div
                            key={photo.id}
                            className={`group relative rounded-2xl overflow-hidden border transition-all ${
                                photo.is_active
                                    ? 'border-gray-200 dark:border-white/10'
                                    : 'border-red-200 dark:border-red-500/20 opacity-50'
                            } bg-white dark:bg-zinc-900/40`}
                        >
                            <div className="aspect-[4/5] overflow-hidden">
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Overlay actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => handleToggle(photo)}
                                    title={photo.is_active ? 'Hide from site' : 'Show on site'}
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                    {photo.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <a
                                    href={photo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => handleDelete(photo)}
                                    className="w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Status badge */}
                            {!photo.is_active && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                    Hidden
                                </div>
                            )}

                            {/* Info bar */}
                            <div className="p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Tag size={11} className="text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{photo.category}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{photo.title}</p>
                                {photo.description && (
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{photo.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CmsPortfolio;
