// src/components/Sidebar.tsx
import React from 'react';
import { supabase } from '../supabaseClient';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  onAddCategory: (newCategory: Category) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, onAddCategory, selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    const value = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const label = newCategoryName;
    const newCategory = { label, value };

    const { error } = await supabase.from('categories').insert([{ label, value }]);
    if (error) {
      console.error('Failed to insert category:', error);
      return;
    }

    onAddCategory(newCategory);
    setNewCategoryName('');
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: '#1e1e1e', color: 'white', border: 'none', padding: '10px' }}
      >
        ☰
      </button>

      {isOpen && (
        <div style={{ width: '250px', background: '#1e1e1e', color: 'white', padding: '10px', height: '100vh', position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
          <h2>Categories</h2>
                    <div style={{ marginTop: '20px' }}>
            <h4>Add Category</h4>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{ width: '100%' }}
            />
            <button onClick={handleAdd} style={{ marginTop: '5px', width: '100%' }}>Add</button>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            style={{ width: '100%', padding: '5px', marginBottom: '10px', marginTop: '10px' }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {selectedCategory && (
            <div style={{ marginTop: '10px' }}>
              <strong>Selected:</strong> {categories.find(c => c.value === selectedCategory)?.label}
            </div>
          )}


        </div>
      )}
    </div>
  );
};

export default Sidebar;
