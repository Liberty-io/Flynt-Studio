import React, { useState } from 'react';

export type Field =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'multi-select'; key: string; label: string; options: string[] };

export type A2UISchema = {
  title?: string;
  fields: Field[];
};

export type DynamicFormProps = {
  schema: A2UISchema;
  onSubmit: (values: Record<string, any>) => void;
};

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setValues((s) => ({ ...s, [key]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      {schema.title && <h3>{schema.title}</h3>}
      {schema.fields.map((f) => {
        if (f.type === 'text') {
          return (
            <div key={f.key} style={{ marginBottom: 8 }}>
              <label>{f.label}</label>
              <input
                type="text"
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          );
        }

        if (f.type === 'textarea') {
          return (
            <div key={f.key} style={{ marginBottom: 8 }}>
              <label>{f.label}</label>
              <textarea
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => handleChange(f.key, e.target.value)}
                style={{ width: '100%', minHeight: 80 }}
              />
            </div>
          );
        }

        if (f.type === 'multi-select') {
          return (
            <div key={f.key} style={{ marginBottom: 8 }}>
              <label>{f.label}</label>
              <select
                multiple
                value={values[f.key] || []}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
                  handleChange(f.key, opts);
                }}
                style={{ width: '100%' }}
              >
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return null;
      })}

      <div style={{ marginTop: 12 }}>
        <button type="submit">Approve</button>
      </div>
    </form>
  );
}

export { A2UISchema };
