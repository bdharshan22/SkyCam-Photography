import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Info, Aperture, Timer, ImageIcon, Camera } from 'lucide-react';
import { PhotoItem } from '../types';

interface LightboxProps {
    photo: PhotoItem;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    const [scale, setScale] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Panning Logic State
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Touch Navigation State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Reset state when photo changes
    useEffect(() => {
        setScale(1);
        setIsLoaded(false);
        setPosition({ x: 0, y: 0 });
    }, [photo]);

    // Reset position if zoomed out
    useEffect(() => {
        if (scale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [scale]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight' && hasNext) onNext();
            if (e.key === 'ArrowLeft' && hasPrev) onPrev();
            if (e.key === 'i') setShowInfo(prev => !prev); // Shortcut for info
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev, hasNext, hasPrev]);

    // Zoom Handlers
    const handleZoomIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, 1));
    };

    // Simulated Exif Data
    function indexToCamera(id: number) {
        return id % 2 === 0 ? 'Sony A7R IV' : 'Canon EOS R5';
    }

    const exifData = {
        camera: indexToCamera(photo.id),
        lens: '85mm f/1.4 GM',
        aperture: 'f/1.8',
        iso: 'ISO 200',
        shutter: '1/250s'
    };

    // Mouse Event Handlers (Click & Drag Pan)
    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Touch Event Handlers (Swipe)
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && hasNext) {
            onNext();
        }
        if (isRightSwipe && hasPrev) {
            onPrev();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in-up touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white ml-4">
                    <h3 className="text-lg font-serif font-medium tracking-wide">{photo.title}</h3>
                    <p className="text-xs text-brand-400 uppercase tracking-widest font-bold">{photo.category}</p>
                </div>
                <div className="flex items-center gap-2 mr-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
                        className={`p-2 rounded-full transition-all ${showInfo ? 'bg-brand-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        title="View Camera Details (i)"
                    >
                        <Info size={20} />
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30"
                        disabled={scale <= 1}
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleZoomIn}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all disabled:opacity-30"
                        disabled={scale >= 3}
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 transition-all ml-4"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Exif Info Panel (Floating Glass Card) */}
            {showInfo && (
                <div className="absolute bottom-24 left-8 z-50 w-72 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white animate-fade-in-up shadow-2xl">
                    <h4 className="text-xs text-brand-400 font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Camera Settings</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Camera size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">Camera</p>
                                <p className="font-medium text-sm">{exifData.camera}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ImageIcon size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">Lens</p>
                                <p className="font-medium text-sm">{exifData.lens}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <Aperture size={14} className="mx-auto mb-1 text-gray-400" />
                                <p className="text-xs font-mono">{exifData.aperture}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <span className="block text-[10px] text-gray-400 mb-[2px]">ISO</span>
                                <p className="text-xs font-mono">{exifData.iso}</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-2 text-center">
                                <Timer size={14} className="mx-auto mb-1 text-gray-400" />
                                <p className="text-xs font-mono">{exifData.shutter}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            {hasPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all z-50 group backdrop-blur-sm hidden md:block"
                >
                    <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            )}

            {hasNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all z-50 group backdrop-blur-sm hidden md:block"
                >
                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}

            {/* Main Image Container */}
            <div
                className={`w-full h-full flex items-center justify-center overflow-hidden p-4 md:p-12 ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                onClick={onClose}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={photo.url}
                    alt={photo.title}
                    className={`max-w-full max-h-full object-contain transition-transform duration-100 ease-out shadow-2xl select-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                    onLoad={() => setIsLoaded(true)}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                />
            </div>
        </div>
    );
};

export default Lightbox;
