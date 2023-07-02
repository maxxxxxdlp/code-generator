import React from 'react';
import { Test, TestCases } from './TestCases.tsx';
import { RA } from '../utils/types.ts';
import { Results } from './Results.tsx';
import { generateProgram } from '../generator';

const defaultTestCases: RA<Test> = [
  [2, 4],
  [4, 8],
];

export function App(): React.ReactElement {
  const [results, setResults] = React.useState<RA<string>>([]);
  const [testCases, setTestCases] = React.useState<RA<Test>>(defaultTestCases);
  const [iterations, setIterations] = React.useState(1);
  const [lengthLimit, setLengthLimit] = React.useState(100);
  return (
    <>
      <h1 className="p-4">JavaScript code generator</h1>
      <form
        className="flex w-fit flex-col gap-2 p-4"
        onSubmit={(event): void => {
          event.preventDefault();
          setResults(generateProgram(iterations, testCases, lengthLimit));
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
          Soft token length limit:
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
        <p>
          Double click on the text in [Square Brackets] to trigger the
          corresponding action
        </p>
      </form>
      <Results results={[results, setResults]} />
    </>
  );
}
