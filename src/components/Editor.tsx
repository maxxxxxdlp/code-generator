import { indentUnit } from '@codemirror/language';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { EditorView } from '@codemirror/view';
import { isDarkMode } from '../utils/utils.ts';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';

const extension = [javascript(), EditorView.lineWrapping, indentUnit.of('  ')];

export function Editor({
  value,
  onChange: handleChange,
  className = '',
}: {
  readonly value: string;
  readonly onChange: ((value: string) => void) | undefined;
  readonly className?: string;
}): React.ReactElement {
  return (
    <CodeMirror
      extensions={extension}
      readOnly={handleChange === undefined}
      theme={isDarkMode ? okaidia : xcodeLight}
      className={`border-brand-300 w-full flex-1 overflow-auto border dark:border-none [&>.cm-editor]:h-full ${className}`}
      value={value}
      onChange={handleChange}
    />
  );
}
