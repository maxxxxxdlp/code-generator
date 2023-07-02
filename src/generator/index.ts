import { RA } from '../utils/types.ts';
import { inputOutputVariable } from './syntax.ts';
import { generateCode } from './code.ts';
import { Test } from '../components/TestCases.tsx';

export const generateProgram = (
  iterations: number,
  testCases: RA<Test>,
  softTokenLimit: number
): RA<string> =>
  Array.from(
    { length: iterations },
    () =>
      `function magic(${inputOutputVariable}) {\n${indentSymbol}${indent(
        generateCode({ softTokenLimit })
      )
        .join('\n')
        .trim()}\n}`
  );

const indentSymbol = '  ';
const indent = (code: RA<string>, indent: number = 1): RA<string> =>
  code.reduce<{ readonly lines: RA<string>; readonly indent: number }>(
    ({ lines, indent }, line, index) => ({
      lines: [
        ...lines,
        `${Array.from({ length: indent }).fill(indentSymbol).join('')}${
          line.endsWith('};') ? line.slice(0, -1) : line
        }`,
      ],
      indent: line.endsWith('{')
        ? indent + 1
        : code[index + 1]?.endsWith('};') === true
        ? indent - 1
        : indent,
    }),
    {
      lines: [],
      indent,
    }
  ).lines;
