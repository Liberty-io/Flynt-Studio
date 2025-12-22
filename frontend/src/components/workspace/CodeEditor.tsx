import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

export type CodeEditorHandle = {
  appendText: (text: string) => void
  setText: (text: string) => void
}

// Minimal editor stub with streaming append API. Replace with Monaco integration later.
const CodeEditor = forwardRef<CodeEditorHandle, { initial?: string }>(function CodeEditor(
  { initial = '' },
  ref
) {
  const [text, setText] = useState(initial)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useImperativeHandle(ref, () => ({
    appendText: (t: string) => setText((s) => s + t),
    setText: (t: string) => setText(t),
  }))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: '100%', minHeight: 240 }}
      />
    </div>
  )
})

export default CodeEditor
