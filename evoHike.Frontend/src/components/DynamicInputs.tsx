import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// 1. Az adatszerkezet definiálása
interface FormItem {
  id: number;
  name: string;
  description: string;
}

interface FormData {
  title: string;
  email: string;
  items: FormItem[];
}

function DynamicInputs() {
  // Inicializálás típusos állapottal
  const [formData, setFormData] = useState<FormData>({
    title: '',
    email: '',
    items: [{ id: Date.now(), name: '', description: '' }],
  });

  // Mező hozzáadása
  const addItem = (): void => {
    if (formData.items.length < 5) {
      const newItem: FormItem = { id: Date.now(), name: '', description: '' };
      setFormData({
        ...formData,
        items: [...formData.items, newItem],
      });
    }
  };

  // Mező törlése
  const removeItem = (id: number): void => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      });
    }
  };

  // Inputok kezelése (dinamikus kulccsal)
  const handleItemChange = (
    id: number,
    fieldName: keyof FormItem,
    value: string,
  ): void => {
    const updatedItems = formData.items.map((item) =>
      item.id === id ? { ...item, [fieldName]: value } : item,
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('TSX Form adatok:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Projekt Adatok</h2>

      <input
        type="text"
        placeholder="Projekt neve"
        value={formData.title}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, title: e.target.value })
        }
        required
      />

      <div className="dynamic-section">
        {formData.items.map((item) => (
          <div key={item.id} className="input-group">
            <input
              type="text"
              placeholder="Név"
              value={item.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleItemChange(item.id, 'name', e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Leírás"
              value={item.description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleItemChange(item.id, 'description', e.target.value)
              }
            />
            {formData.items.length > 1 && (
              <button type="button" onClick={() => removeItem(item.id)}>
                Törlés
              </button>
            )}
          </div>
        ))}
      </div>

      {formData.items.length < 5 && (
        <button type="button" onClick={addItem}>
          + Mező hozzáadása
        </button>
      )}

      <button type="submit" style={{ marginTop: '20px', display: 'block' }}>
        Küldés
      </button>
    </form>
  );
}

export default DynamicInputs;
