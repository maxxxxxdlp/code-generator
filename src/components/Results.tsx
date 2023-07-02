import { Editor } from './Editor.tsx';
import React from 'react';
import { GetSet, IR, RA } from '../utils/types.ts';
import { capitalize, removeItem } from '../utils/utils.ts';

const actionsLine = '// #';
const reIndex = /\/\/ #(\d+)/;

export function Results({
  results: [results, setResults],
}: {
  readonly results: GetSet<RA<string>>;
}): React.ReactElement {
  const commands: IR<(index: number) => void> = {
    copy: (index) =>
      void navigator.clipboard.writeText(results[index]).catch(console.log),
    remove: (index) => setResults(removeItem(results, index)),
  };

  const toAction = (run: number, commandName: keyof typeof commands) =>
    `${run}_${commandName}`;

  const [activeActions, setActiveActions] = React.useState<RA<string>>([]);
  const joinedResults = results
    .map(
      (result, index) =>
        `${actionsLine}${index + 1}    ${Object.keys(commands)
          .map(
            (key) =>
              `[${
                activeActions.includes(toAction(index, key))
                  ? key.toUpperCase()
                  : capitalize(key)
              }]`
          )
          .join('  ')}\n${result}`
    )
    .join('\n\n\n');
  return (
    <>
      <Editor
        value={joinedResults}
        onChange={undefined}
        onSelect={(line, content): void => {
          const command = content.toLowerCase();
          if (
            !joinedResults.slice(line.from, line.to).startsWith(actionsLine) ||
            !(command in commands)
          )
            return;
          const lineContent = joinedResults.slice(line.from, line.to);
          const runIndex = lineContent.match(reIndex)?.[1];
          if (runIndex === undefined) return;
          const index = Number.parseInt(runIndex) - 1;
          commands[command](index);
          const action = toAction(index, command);
          setActiveActions([...activeActions, action]);
          setTimeout(() => {
            setActiveActions(
              activeActions.filter((action) => action !== action)
            );
          }, 1000);
        }}
      />
    </>
  );
}
