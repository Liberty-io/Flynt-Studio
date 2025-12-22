import React, { useState } from 'react'

export type Field =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'multi-select'; key: string; label: string; options: string[] }

export type A2UISchema = {
  title?: string
  fields: Field[]
}

export type DynamicFormProps = {
  schema: A2UISchema
  onSubmit: (values: Record<string, any>) => void
  requestId?: string
}

export default function DynamicForm({ schema, onSubmit, requestId }: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, any>>({})
  const formId = requestId ? `form-${requestId}` : 'dynamic-form'

  const handleChange = (key: string, value: any) => {
    setValues((s) => ({ ...s, [key]: value }))
  }

  return (
    <form
      id={formId}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(values)
      }}
      noValidate
    >
      {schema.title && (
        <h3 id={`${formId}-title`} style={{ marginTop: 0, marginBottom: 12 }}>
          {schema.title}
        </h3>
      )}

      <fieldset style={{ border: 'none', padding: 0 }}>
        {schema.fields.map((f) => {
          const fieldId = `${formId}-${f.key}`

          if (f.type === 'text') {
            return (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label
                  htmlFor={fieldId}
                  style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}
                >
                  {f.label}
                </label>
                <input
                  id={fieldId}
                  type="text"
                  placeholder={f.placeholder}
                  value={values[f.key] || ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  aria-labelledby={`${formId}-title`}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )
          }

          if (f.type === 'textarea') {
            return (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label
                  htmlFor={fieldId}
                  style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}
                >
                  {f.label}
                </label>
                <textarea
                  id={fieldId}
                  placeholder={f.placeholder}
                  value={values[f.key] || ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  aria-labelledby={`${formId}-title`}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )
          }

          if (f.type === 'multi-select') {
            return (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label
                  htmlFor={fieldId}
                  style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}
                >
                  {f.label}
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {' '}
                    (hold Ctrl/Cmd to select multiple)
                  </span>
                </label>
                <select
                  id={fieldId}
                  multiple
                  value={values[f.key] || []}
                  onChange={(e) => {
                    const opts = Array.from(e.target.selectedOptions).map((o) => o.value)
                    handleChange(f.key, opts)
                  }}
                  aria-labelledby={`${formId}-title`}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                  }}
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            )
          }

          return null
        })}
      </fieldset>

      <div style={{ marginTop: 16, display: 'flex', gap: '8px' }}>
        <button
          type="submit"
          aria-label="Approve and submit this form"
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          Approve
        </button>
      </div>
    </form>
  )
}

export { A2UISchema }
