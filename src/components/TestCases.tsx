import { GetSet, RA } from '../utils/types.ts';
import React from 'react';
import {parseNumber, removeItem, replaceItem} from '../utils/utils.ts';

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
                type="number"
                required
                aria-label="Test"
                className="w-full"
                value={input}
                onChange={({ target: { value: input } }) =>
                  setState(
                    replaceItem(state, index, [parseNumber(input) ?? 0, output])
                  )
                }
              />
            </td>
            <td>
              <input
                type="number"
                required
                aria-label="Result"
                className="w-full"
                value={output}
                onChange={({ target: { value: output } }) =>
                  setState(
                    replaceItem(state, index, [input, parseNumber(output) ?? 0])
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
