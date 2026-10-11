import React, { useState, useRef } from 'react';
import { Plus, Trash2, ArrowLeft, ArrowRight, Edit3, Image as ImageIcon, Check, X, Filter } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { GalleryPhoto } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface GallerySectionProps {
  onOpenGalleryLightbox: (index: number) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenGalleryLightbox }) => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [activeTag, setActiveTag] = useState<string>('All');
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryPhoto>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Extract unique tags for category filter
  const allTags = Array.from(
    new Set(data.gallery.map((p) => p.tag).filter(Boolean))
  ) as string[];

  const filteredPhotos =
    activeTag === 'All'
      ? data.gallery
      : data.gallery.filter((p) => p.tag === activeTag);

  const startEdit = (photo: GalleryPhoto) => {
    setEditingPhotoId(photo.id);
    setEditForm({ ...photo });
  };

  const cancelEdit = () => {
    setEditingPhotoId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingPhotoId) return;
    updateData((prev) => ({
      gallery: prev.gallery.map((p) =>
        p.id === editingPhotoId ? ({ ...p, ...editForm } as GalleryPhoto) : p
      ),
    }));
    cancelEdit();
  };

  const handleAddPhoto = () => {
    const newId = `photo-${Date.now()}`;
    const newPhoto: GalleryPhoto = {
      id: newId,
      imageUrl: data.gallery[0]?.imageUrl || data.heroImageUrl,
      caption: 'A moment I never want to forget with you.',
      date: 'Recent',
      tag: 'Sweet Moments',
    };
    updateData((prev) => ({
      gallery: [...prev.gallery, newPhoto],
    }));
    startEdit(newPhoto);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this photo from our gallery?')) return;
    updateData((prev) => ({
      gallery: prev.gallery.filter((p) => p.id !== id),
    }));
  };

  const movePhoto = (index: number, direction: 'prev' | 'next') => {
    const newGallery = [...data.gallery];
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newGallery.length) return;
    const [moved] = newGallery.splice(index, 1);
    newGallery.splice(targetIndex, 0, moved);
    updateData({ gallery: newGallery });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 0.85);
      setEditForm((prev) => ({ ...prev, imageUrl: compressed }));
    } catch {
      alert('Could not upload photo. Try another file.');
    }
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 border-t border-rose-100 dark:border-rose-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">
            Captured Smiles
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">
            Our Gallery of Memories
          </h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
            A small glimpse into the countless adventures, quiet mornings, and warm moments we have shared.
          </p>

          {isCreatorMode && (
            <button
              onClick={handleAddPhoto}
              className="mt-4 px-4 py-2 text-xs font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo to Gallery</span>
            </button>
          )}
        </div>

        {/* Filter Controls (Segmented Tabs) */}
        {allTags.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            <button
              onClick={() => setActiveTag('All')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                activeTag === 'All'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
              }`}
            >
              All ({data.gallery.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  activeTag === tag
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => {
            const isEditing = editingPhotoId === photo.id;

            return (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-stone-800 border border-rose-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                {/* Photo container */}
                <div
                  onClick={() => !isEditing && onOpenGalleryLightbox(index)}
                  className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-700 cursor-pointer"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Anniversary photo'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-light tracking-wide">
                      Click to view full photo
                    </span>
                  </div>
                </div>

                {/* Caption & Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-600">
                          Edit Photo Info
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 rounded bg-emerald-600 text-white text-xs"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={editForm.caption || ''}
                        onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                        placeholder="Romantic photo caption..."
                        className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editForm.date || ''}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          placeholder="Date / Year"
                          className="px-2 py-1 text-xs rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                        />
                        <input
                          type="text"
                          value={editForm.tag || ''}
                          onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                          placeholder="Tag (e.g. Adventures)"
                          className="px-2 py-1 text-xs rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                        />
                      </div>

                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-1 rounded border border-dashed border-stone-400 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center justify-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3 text-rose-500" />
                          <span>Replace Photo File</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-stone-700 dark:text-stone-200 font-serif leading-snug">
                        "{photo.caption}"
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-400">
                        {photo.date && <span>{photo.date}</span>}
                        {photo.tag && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{photo.tag}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Creator controls on card */}
                  {isCreatorMode && !isEditing && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between">
                      <div className="flex gap-1">
                        <button
                          onClick={() => movePhoto(index, 'prev')}
                          disabled={index === 0}
                          className="p-1 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 disabled:opacity-30 text-xs"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePhoto(index, 'next')}
                          disabled={index === data.gallery.length - 1}
                          className="p-1 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 disabled:opacity-30 text-xs"
                          title="Move Right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(photo)}
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
