import React from 'react';
import { supabase } from '../supabaseClient';
import { Category } from '../types';
import { Pin } from '../types';

interface SidebarProps {
  categories: Category[];
  onAddCategory: (newCategory: Category) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  pins: Pin[];
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  onAddCategory,
  selectedCategory,
  onCategoryChange,
  pins,
  
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');

  //filter pins based on category
  const filteredPins = selectedCategory
  ? pins.filter((pin) => pin.category === selectedCategory)
  : [];


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
    {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '90px',
          left: '10px',
          zIndex: 1100,
          background: '#ffffff',
          color: 'black',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        ☰
      </button>
    )}

    {isOpen && (
      <div
        style={{
          width: '250px',
          background: '#ffffff',
          color: 'black',
          padding: '20px 15px',
          height: 'calc(100vh - 80px)',
          position: 'fixed',
          top: '80px',
          left: 0,
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
        }}
      >
        
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: '10px', marginTop: '30px' }}>Categories</h2>

        <div style={{ marginBottom: '20px' }}>
          <h4>Add Category</h4>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={{
              width: '92%',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '5px',
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {selectedCategory && (
          <div>
            <strong>Selected:</strong>{' '}
            {categories.find((c) => c.value === selectedCategory)?.label}
          </div>
        )}
        {filteredPins.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '10px' }}>TikToks in this category</h4>
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
                {filteredPins.map((pin) => (
                  <li key={pin.id} style={{ marginBottom: '15px' }}>
                    <img
                      src={pin.thumbnail_url}

                      style={{ width: '100%', borderRadius: '6px' }}
                    />
                    <a
                      href={pin.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '5px', fontSize: '14px', color: '#6366f1' }}
                    >
                      View TikTok
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Sidebar;
