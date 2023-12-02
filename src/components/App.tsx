import React from 'react';
import { Test, TestCases } from './TestCases.tsx';
import { RA } from '../utils/types.ts';
import { generateProgram } from '../generator';
import { Editor } from './Editor.tsx';

const defaultTestCases: RA<Test> = [
  [2, 4],
  [4, 8],
];

export function App(): React.ReactElement {
  const [result, setResult] = React.useState<string>('');
  const [testCases, setTestCases] = React.useState<RA<Test>>(defaultTestCases);
  const [iterations, setIterations] = React.useState(1000);
  const [lengthLimit, setLengthLimit] = React.useState(100);
  return (
    <>
      <h1 className="p-4">JavaScript code generator</h1>
      <form
        className="flex w-fit flex-col gap-2 p-4"
        onSubmit={(event): void => {
          event.preventDefault();
          window.requestIdleCallback(() =>
            setResult(generateProgram(iterations, testCases, lengthLimit))
          );
        }}
      >
        <TestCases state={[testCases, setTestCases]} />
        <label className="flex items-center gap-2">
          Iteration limit:
          <input
            type="number"
            value={iterations}
            min={1}
            onChange={({ target }) =>
              setIterations(Number.parseInt(target.value))
            }
          />
        </label>
        <label className="flex items-center gap-2">
          Soft token count limit:
          <input
            type="number"
            value={lengthLimit}
            min={1}
            onChange={({ target }) =>
              setLengthLimit(Number.parseInt(target.value))
            }
          />
        </label>
        <input type="submit" value="Generate" />
      </form>
      <Editor value={result} onChange={undefined} />
      <a href="https://github.com/maxpatiiuk/code-generator/" target="_blank" className="absolute top-0 right-0 p-4">
        View Source on GitHub
      </a>
    </>
  );
}
