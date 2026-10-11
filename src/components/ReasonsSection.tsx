import React, { useState } from 'react';
import { Heart, Plus, Trash2, Edit3, Sparkles, Check, X } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { ReasonCard } from '../types';

export const ReasonsSection: React.FC = () => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ReasonCard>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const startEdit = (card: ReasonCard) => {
    setEditingId(card.id);
    setEditForm({ ...card });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateData((prev) => ({
      reasons: prev.reasons.map((r) =>
        r.id === editingId ? ({ ...r, ...editForm } as ReasonCard) : r
      ),
    }));
    cancelEdit();
  };

  const handleAddReason = () => {
    const nextNum = data.reasons.length + 1;
    const newReason: ReasonCard = {
      id: `reason-${Date.now()}`,
      number: nextNum,
      title: 'A New Little Thing I Adore',
      description: 'Describe what makes you smile whenever you think of this...',
    };
    updateData((prev) => ({
      reasons: [...prev.reasons, newReason],
    }));
    startEdit(newReason);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this reason card?')) return;
    updateData((prev) => ({
      reasons: prev.reasons.filter((r) => r.id !== id),
    }));
  };

  const handlePickRandom = () => {
    if (data.reasons.length === 0) return;
    const randomCard = data.reasons[Math.floor(Math.random() * data.reasons.length)];
    setHighlightedId(randomCard.id);
    // Scroll element into view smoothly
    const elem = document.getElementById(`reason-card-${randomCard.id}`);
    elem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="reasons" className="py-16 sm:py-24 border-t border-rose-100 dark:border-rose-950/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">
            Endless Gratitude
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">
            Reasons Why I Love You
          </h2>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
            Out of ten thousand reasons, here are just a few of the things that make my world brighter every day.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handlePickRandom}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 hover:bg-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Pick a Reason for Today</span>
            </button>

            {isCreatorMode && (
              <button
                onClick={handleAddReason}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reason</span>
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.reasons.map((reason, index) => {
            const isEditing = editingId === reason.id;
            const isHighlighted = highlightedId === reason.id;

            return (
              <div
                id={`reason-card-${reason.id}`}
                key={reason.id}
                className={`relative p-6 rounded-2xl border transition-all ${
                  isHighlighted
                    ? 'ring-2 ring-rose-500 bg-rose-50/70 dark:bg-rose-950/40 border-rose-400 scale-[1.02]'
                    : 'bg-white/80 dark:bg-stone-800/80 border-rose-100 dark:border-stone-800 hover:shadow-lg'
                } flex flex-col justify-between`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-600">
                        Edit Reason #{index + 1}
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

                    <input
                      type="text"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Reason Title"
                      className="w-full px-2.5 py-1 text-sm font-semibold rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                    />

                    <textarea
                      rows={3}
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Why this means so much to you..."
                      className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                    />
                  </div>
                ) : (
                  <div>
                    {/* Editorial Number */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-semibold text-rose-500 tracking-wider">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-200" />
                    </div>

                    <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {reason.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                )}

                {/* Creator Controls */}
                {isCreatorMode && !isEditing && (
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(reason)}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reason.id)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
