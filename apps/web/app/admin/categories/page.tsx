'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
};

const EMPTY_FORM: FormState = { name: '', slug: '', description: '' };

function toSlug(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fetchCategories() {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function startEdit(cat: Category) {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' });
    setShowNew(false);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowNew(false);
    setError(null);
  }

  async function handleSave(id?: string) {
    setSaving(true);
    setError(null);
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `/api/admin/categories/${id}` : '/api/admin/categories';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      fetchCategories();
      cancelEdit();
    } else {
      const data = await res.json();
      setError(data.error ?? 'Save failed');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  }

  async function toggleActive(cat: Category) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !cat.is_active }),
    });
    fetchCategories();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-brand text-2xl text-[--color-deep-brown]">Categories</h1>
        <Button onClick={() => { setShowNew(true); setEditing(null); setForm(EMPTY_FORM); }}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* New category form */}
      {showNew && (
        <div className="mb-5 rounded-xl border border-[--color-border] bg-[--color-surface] p-5">
          <h2 className="mb-4 text-sm font-semibold">New Category</h2>
          <CategoryForm form={form} setForm={setForm} error={error} saving={saving} onSave={() => handleSave()} onCancel={cancelEdit} />
        </div>
      )}

      {/* Categories list */}
      <div className="rounded-xl border border-[--color-border] bg-[--color-surface] overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm text-[--color-secondary-text]">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-sm text-[--color-secondary-text]">No categories yet.</div>
        ) : (
          <div className="divide-y divide-[--color-border]">
            {categories.map((cat) => (
              <div key={cat.id}>
                {editing === cat.id ? (
                  <div className="p-4">
                    <CategoryForm
                      form={form}
                      setForm={setForm}
                      error={error}
                      saving={saving}
                      onSave={() => handleSave(cat.id)}
                      onCancel={cancelEdit}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <GripVertical className="h-4 w-4 text-[--color-secondary-text] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cat.name}</p>
                      <p className="text-xs text-[--color-secondary-text]">/{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => toggleActive(cat)}
                      className={`text-xs ${cat.is_active ? 'text-[--color-success]' : 'text-[--color-secondary-text]'}`}
                    >
                      {cat.is_active ? 'Active' : 'Hidden'}
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                      className="text-[--color-error] hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryForm({
  form,
  setForm,
  error,
  saving,
  onSave,
  onCancel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  error: string | null;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium">Name *</label>
        <Input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })
          }
          placeholder="Dresses"
          className="h-9 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium">Slug *</label>
        <Input
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="dresses"
          className="h-9 text-sm"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium">Description</label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Optional description"
          className="h-9 text-sm"
        />
      </div>
      {error && <p className="text-xs text-[--color-error]">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
