import {RA} from '../utils/types.ts';
import {inputOutputVariable} from './syntax.ts';
import {generateCode} from './code.ts';
import {Test} from '../components/TestCases.tsx';
import {mappedFind} from '../utils/utils.ts';

export const generateProgram = (
    iterations: number,
    testCases: RA<Test>,
    softTokenLimit: number
): string =>
    mappedFind(Array.from({length: iterations}), (_, index) => {
        const mainCode = generateCode({softTokenLimit})
        const code = `function magic(${inputOutputVariable}) {\n${indentSymbol}${indent(
            mainCode
        )
            .join('\n')
            .trim()}\n}`;
        try {
            // Executing randomly generated code. What could possibly go wrong? 🤷
            const magic = new Function(inputOutputVariable, mainCode.join('\n'));
            const callback = magic as unknown as (input: number) => number;
            if (testCases.every(([input, output]) => callback(input) === output))
                return `// Found a solution after ${index} iterations\n${code}`;
        } catch (error) {
            console.error('Generated function is not valid', {error, code, testCases});
        }
        return undefined;
    }) ?? `// Unable to find a solution after ${iterations} iterations.`;

const indentSymbol = '  ';
const indent = (code: RA<string>, indent: number = 1): RA<string> =>
    code.reduce<{ readonly lines: RA<string>; readonly indent: number }>(
        ({lines, indent}, line, index) => ({
            lines: [
                ...lines,
                `${Array.from({length: indent}).fill(indentSymbol).join('')}${
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
