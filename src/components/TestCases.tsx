import { GetSet, RA } from '../utils/types.ts';
import React from 'react';
import { removeItem, replaceItem } from '../utils/utils.ts';

export type Test = readonly [input: number, output: number];

export function TestCases({
  state: [state, setState],
}: {
  readonly state: GetSet<RA<Test>>;
}): React.ReactElement {
  return (
    <table>
      <thead>
        <tr>
          <th>Test</th>
          <th>Result</th>
          <td />
        </tr>
      </thead>
      <tbody>
        {state.map(([input, output], index) => (
          <tr key={index}>
            <td>
              <input
                type="text"
                required
                aria-label="Test"
                min={-20}
                max={20}
                value={input}
                onChange={({ target: { value: input } }) =>
                  setState(
                    replaceItem(state, index, [Number.parseInt(input), output])
                  )
                }
              />
            </td>
            <td>
              <input
                type="number"
                required
                aria-label="Result"
                min={-20}
                max={20}
                value={output}
                onChange={({ target: { value: output } }) =>
                  setState(
                    replaceItem(state, index, [input, Number.parseInt(output)])
                  )
                }
              />
            </td>
            <td>
              <button
                type="button"
                onClick={() => setState(removeItem(state, index))}
                aria-label="Delete"
              >
                X
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={3}>
            <button
              type="button"
              onClick={(): void => setState([...state, [0, 0]])}
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
