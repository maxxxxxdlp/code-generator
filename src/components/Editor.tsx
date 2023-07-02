import { indentUnit } from '@codemirror/language';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { EditorView } from '@codemirror/view';
import { isDarkMode } from '../utils/utils.ts';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';
import { Line } from '@codemirror/state';

const extension = [javascript(), EditorView.lineWrapping, indentUnit.of('  ')];

export function Editor({
  value,
  onChange: handleChange,
  onSelect: handleSelect,
  className = '',
}: {
  readonly value: string;
  readonly onChange: ((value: string) => void) | undefined;
  readonly className?: string;
  readonly onSelect?: (line: Line, value: string) => void;
}): React.ReactElement {
  // const codeMirrorRef = React.useRef<ReactCodeMirrorRef | null>(null);
  return (
    <CodeMirror
      // ref={codeMirrorRef}
      onUpdate={({ state }): void => {
        const selection = state.selection.ranges.at(-1);
        if (selection === undefined) return;
        const line = state.doc.lineAt(selection.from);
        const startLine = line.number;
        const endLine = state.doc.lineAt(selection.to).number;
        if (startLine !== endLine) return;

        const content = value.slice(selection.from, selection.to).trim();
        if (content.length > 0) handleSelect?.(line, content);
      }}
      extensions={extension}
      readOnly={handleChange === undefined}
      theme={isDarkMode ? okaidia : xcodeLight}
      className={`border-brand-300 w-full flex-1 overflow-auto border dark:border-none ${className}`}
      value={value}
      onChange={handleChange}
    />
  );
}
