import React, { useState, useRef } from 'react';
import { Calendar, MapPin, Plus, Trash2, ArrowUp, ArrowDown, Edit3, Image as ImageIcon, Check, X } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { Milestone } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

interface TimelineSectionProps {
  onOpenMilestoneLightbox: (index: number) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ onOpenMilestoneLightbox }) => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Milestone>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startEdit = (m: Milestone) => {
    setEditingMilestoneId(m.id);
    setEditForm({ ...m });
  };

  const cancelEdit = () => {
    setEditingMilestoneId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingMilestoneId) return;
    updateData((prev) => ({
      milestones: prev.milestones.map((m) =>
        m.id === editingMilestoneId ? ({ ...m, ...editForm } as Milestone) : m
      ),
    }));
    cancelEdit();
  };

  const handleAddMilestone = () => {
    const newId = `milestone-${Date.now()}`;
    const newMilestone: Milestone = {
      id: newId,
      date: 'New Date',
      title: 'Our Next Special Memory',
      description: 'Describe this cherished moment that you shared together...',
      imageUrl: data.milestones[0]?.imageUrl || data.heroImageUrl,
      location: 'Our Favorite Spot',
    };
    updateData((prev) => ({
      milestones: [...prev.milestones, newMilestone],
    }));
    startEdit(newMilestone);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this memory?')) return;
    updateData((prev) => ({
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    const newMilestones = [...data.milestones];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMilestones.length) return;
    const [moved] = newMilestones.splice(index, 1);
    newMilestones.splice(targetIndex, 0, moved);
    updateData({ milestones: newMilestones });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1400, 0.82);
      setEditForm((prev) => ({ ...prev, imageUrl: compressed }));
    } catch {
      alert('Failed to upload image. Please try another file.');
    }
  };

  return (
    <section id="story" className="py-16 sm:py-24 border-t border-rose-100 dark:border-rose-950/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">
            Chapters of Love
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">
            Our Story, Step by Step
          </h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
            Every step we took led us to each other. Here are the milestones that made us who we are today.
          </p>

          {isCreatorMode && (
            <button
              onClick={handleAddMilestone}
              className="mt-4 px-4 py-2 text-xs font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Milestone</span>
            </button>
          )}
        </div>

        {/* Timeline Items */}
        <div className="relative">
          {/* Vertical central hairline line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-px bg-rose-200 dark:bg-rose-900/60" />

          <div className="space-y-12 sm:space-y-16">
            {data.milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isEditing = editingMilestoneId === milestone.id;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node dot on desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose-50 dark:bg-stone-900 border-2 border-rose-400 items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                  </div>

                  {/* Image Card side */}
                  <div className="w-full md:w-1/2">
                    <div
                      onClick={() => onOpenMilestoneLightbox(index)}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-rose-100 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 cursor-pointer"
                    >
                      <img
                        src={milestone.imageUrl}
                        alt={milestone.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                  </div>

                  {/* Content narrative side */}
                  <div className="w-full md:w-1/2">
                    {isEditing ? (
                      <div className="p-5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-rose-400 shadow-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                            Editing Milestone
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={saveEdit}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700"
                              title="Save Changes"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="Milestone Title"
                          className="w-full px-3 py-1.5 text-sm font-semibold rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editForm.date || ''}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            placeholder="Date (e.g. June 18, 2023)"
                            className="px-3 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            placeholder="Location"
                            className="px-3 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                          />
                        </div>

                        <textarea
                          rows={3}
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Tell your romantic memory story here..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                        />

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
                            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-stone-400 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
                            <span>Upload / Replace Photo</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-800/70 border border-rose-100 dark:border-rose-950/60 shadow-sm hover:shadow-md transition-shadow">
                        {/* Date and Location clean metadata */}
                        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium mb-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {milestone.date}
                          </span>
                          {milestone.location && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                                <MapPin className="w-3 h-3" />
                                {milestone.location}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                          {milestone.title}
                        </h3>

                        <p className="mt-2.5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
                          {milestone.description}
                        </p>

                        {/* Creator Toolbar for this milestone */}
                        {isCreatorMode && (
                          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => moveMilestone(index, 'up')}
                                disabled={index === 0}
                                className="p-1 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-rose-600 disabled:opacity-30 text-xs"
                                title="Move Earlier"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveMilestone(index, 'down')}
                                disabled={index === data.milestones.length - 1}
                                className="p-1 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-rose-600 disabled:opacity-30 text-xs"
                                title="Move Later"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(milestone)}
                                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(milestone.id)}
                                className="text-xs text-red-500 hover:underline flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
