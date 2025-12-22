export type Field =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'multi-select'; key: string; label: string; options: string[] }

export type A2UISchema = {
  title?: string
  fields: Field[]
}

export type ActionRequestEnvelope = {
  request_id: string
  ui_schema: A2UISchema
}

export function parseA2UISchema(schema: any): A2UISchema {
  if (!schema || typeof schema !== 'object') {
    return { title: 'Invalid schema', fields: [] }
  }
  const fields = Array.isArray(schema.fields) ? schema.fields : []
  return { title: schema.title, fields } as A2UISchema
}

export const exampleActionRequest: ActionRequestEnvelope = {
  request_id: 'example_approval_1',
  ui_schema: {
    title: 'Approve file write to src/main.py',
    fields: [
      { type: 'textarea', key: 'summary', label: 'Summary of change' },
      {
        type: 'multi-select',
        key: 'files',
        label: 'Files affected',
        options: ['src/main.py', 'src/utils.py'],
      },
    ],
  },
}

export default { parseA2UISchema, exampleActionRequest }
// Minimal A2UI adapter: validate and convert a simple A2UI-like JSON schema

export function validateA2UISchema(schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!schema) {
    errors.push('Schema is empty')
    return { valid: false, errors }
  }
  if (!schema.title) errors.push('Missing title')
  if (!Array.isArray(schema.fields)) errors.push('Missing or invalid fields array')
  else {
    schema.fields.forEach((f: any, i: number) => {
      if (!f.type) errors.push(`fields[${i}].type is required`)
      if (!f.key) errors.push(`fields[${i}].key is required`)
    })
  }
  return { valid: errors.length === 0, errors }
}

export function schemaToFormProps(schema: any) {
  // Convert A2UI-lite to a small props shape for a DynamicForm component
  if (!schema) return { title: '', fields: [] }
  return {
    title: schema.title || '',
    description: schema.description || '',
    fields: (schema.fields || []).map((f: any) => ({
      type: f.type || 'text',
      label: f.label || f.key,
      key: f.key,
      options: f.options || [],
      placeholder: f.placeholder || '',
      default: f.default,
    })),
  }
}
