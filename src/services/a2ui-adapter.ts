export type Field =
  | { type: 'text'; key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'multi-select'; key: string; label: string; options: string[] };

export type A2UISchema = {
  title?: string;
  fields: Field[];
};

export type ActionRequestEnvelope = {
  request_id: string;
  ui_schema: A2UISchema;
};

/**
 * Minimal parser/validator for incoming A2UI lite schemas.
 * For now this performs basic structural validation and returns the schema unchanged.
 */
export function parseA2UISchema(schema: any): A2UISchema {
  if (!schema || typeof schema !== 'object') {
    return { title: 'Invalid schema', fields: [] };
  }
  const fields = Array.isArray(schema.fields) ? schema.fields : [];
  return { title: schema.title, fields } as A2UISchema;
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
};

export default { parseA2UISchema, exampleActionRequest };
