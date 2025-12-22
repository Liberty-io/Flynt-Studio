import { describe, it, expect } from 'vitest'
import { parseA2UISchema, exampleActionRequest } from '../a2ui-adapter'

describe('a2ui-adapter', () => {
  it('should parse valid schema', () => {
    const schema = {
      title: 'Test Schema',
      fields: [
        { type: 'text', key: 'name', label: 'Name' },
        { type: 'textarea', key: 'desc', label: 'Description' },
      ],
    }
    const parsed = parseA2UISchema(schema)
    expect(parsed.title).toBe('Test Schema')
    expect(parsed.fields).toHaveLength(2)
    expect(parsed.fields[0].key).toBe('name')
  })

  it('should handle invalid schema gracefully', () => {
    const parsed = parseA2UISchema(null)
    expect(parsed.fields).toEqual([])
    expect(parsed.title).toBe('Invalid schema')
  })

  it('should handle missing fields array', () => {
    const parsed = parseA2UISchema({ title: 'Test' })
    expect(parsed.fields).toEqual([])
  })

  it('should provide example action request', () => {
    expect(exampleActionRequest.request_id).toBeDefined()
    expect(exampleActionRequest.ui_schema).toBeDefined()
    expect(exampleActionRequest.ui_schema.fields).toHaveLength(2)
  })

  it('should support textarea field type', () => {
    const schema = {
      title: 'Comment',
      fields: [{ type: 'textarea' as const, key: 'comment', label: 'Your comment' }],
    }
    const parsed = parseA2UISchema(schema)
    expect(parsed.fields[0].type).toBe('textarea')
  })

  it('should support multi-select field type', () => {
    const schema = {
      title: 'Choose options',
      fields: [
        { type: 'multi-select' as const, key: 'items', label: 'Items', options: ['A', 'B', 'C'] },
      ],
    }
    const parsed = parseA2UISchema(schema)
    expect(parsed.fields[0].type).toBe('multi-select')
    expect((parsed.fields[0] as any).options).toEqual(['A', 'B', 'C'])
  })
})
