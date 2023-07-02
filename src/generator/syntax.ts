import { IR, RA } from '../utils/types.ts';
import { pickRandom, pickSquared, random } from './util.ts';
import { error, replaceItem } from '../utils/utils.ts';
import variableNames from './variableNames.json';

type GenericToken<KEYS extends string> = KEYS | Term | Command;
type Declaration<KEYS extends string> = readonly [
  // Determines how likely this declaration is to be selected
  priority: number,
  // Defines how "exploratory" this declaration is.
  // More exploratory declarations are less likely to get selected as explorationRate decreases.
  exploration: number,
  // The declaration itself
  ...rest: RA<GenericToken<KEYS>>
];

const createSyntaxTree = <KEYS extends string>(
  tree: Record<KEYS | 'program', RA<Declaration<KEYS>>>
): Record<KEYS | 'program', RA<Declaration<KEYS>>> => tree;

type Term = { readonly term: string };

type Command = (context: Context) => {
  readonly output: string | RA<string>;
  readonly context: Partial<Context>;
};
export type Context = {
  readonly explorationRate: number;
  readonly scopes: RA<RA<string>>;
  readonly output: string[];
  readonly assignmentLeftSide?: string;
};

const term = (term: string): Term => ({ term });

/* Create an [a-z] array */
// const baseVariableNames = Array.from(Array(26)).map((_, i) =>
//   String.fromCharCode(i + 97)
// );
// const reservedNames = new Set(['do','if','in']);
// const variableNames = [
//   ...baseVariableNames,
//   ...baseVariableNames.flatMap((letter) =>
//     baseVariableNames.map((letter2) => `${letter}${letter2}`)
//   ),
// ].filter(name =>!reservedNames.has(name));
const minNumber = 0;
const maxNumber = 20;

/* A helper for quickly modifying context */
const modify =
  (callback: (context: Context) => Partial<Context>): Command =>
  (context) => ({
    context: callback(context),
    output: [],
  });

const command: IR<Command> = {
  newVariable(context) {
    const { scopes } = context;
    const currentScope = scopes.at(-1)!;
    const usedVariables = scopes.flat();
    const availableVariables = variableNames.filter(
      (name) => !usedVariables.includes(name)
    );
    if (availableVariables.length === 0)
      console.warn(
        'Run out of variable names. Will start shadowing. Temporary dead zone collisions may occur.'
      );
    const newVariable = pickRandom(
      availableVariables.length === 0 ? variableNames : availableVariables
    );
    return {
      output: `let ${newVariable}`,
      context: {
        scopes: replaceItem(scopes, -1, [...currentScope, newVariable]),
      },
    };
  },
  variable(context) {
    const { scopes, assignmentLeftSide } = context;
    const nonEmptyScopes = scopes
      .map((scope) =>
        scope.filter((variable) => variable !== assignmentLeftSide)
      )
      .filter((scope) => scope.length > 0);
    if (nonEmptyScopes.length === 0)
      error('No variables available', { context });

    /*
     * Randomly choose a scope and then one of the variables from that scope
     *
     * Closer scopes are quadratically more likely to be picked
     */
    const scopeToUse = pickSquared(nonEmptyScopes.length);
    const scope = nonEmptyScopes[scopeToUse];
    const newVariable = pickRandom(scope);
    return {
      output: newVariable,
      context: {},
    };
  },
  number: (context) => ({
    output: random(minNumber, maxNumber).toString(),
    context,
  }),
  newScope: modify(({ scopes }) => ({
    scopes: [...scopes, []],
  })),
  exitScope: modify(({ scopes }) => ({
    scopes: scopes.slice(0, -1),
  })),
  captureLeftSide: modify(({ output }) => {
    const previous = output.at(-1)!;
    return {
      assignmentLeftSide: previous.startsWith('let ')
        ? previous.slice(4)
        : undefined,
    };
  }),
  clearLeftSide: modify(() => ({
    assignmentLeftSide: undefined,
  })),
} as const;

export const inputOutputVariable = 'value';

/**
 * A definition of a syntax tree (a subset of JavaScript)
 */
export const syntaxTree = createSyntaxTree({
  program: [[1, 0, 'rootStatements', 'return']],
  return: [[1, 0, term('return '), 'existingVariable', term(';\n')]],
  rootStatements: [
    // These numbers don't need to add up to 1
    [0.9, 0.7, 'statement', term(';\n'), 'statements'],
    [0.1, 0.3, 'statement', term(';\n')],
  ],
  statements: [
    [0.9, 0.3, 'rootStatements'],
    [0.05, 0, 'rootStatements', 'return'],
  ],
  statement: [
    [0.2, 0.7, 'ifStatement'],
    [0.8, 0.3, 'assignmentStatement'],
  ],
  ifStatement: [
    [
      1,
      0,
      term('\nif('),
      'expression',
      term(') {\n'),
      command.newScope,
      'statements',
      term('}'),
      command.exitScope,
    ],
  ],
  assignmentStatement: [
    [
      1,
      0,
      'newOrExistingVariable',
      command.captureLeftSide,
      term(' = '),
      'expression',
      command.clearLeftSide,
    ],
  ],
  existingVariable: [
    [0.1, 0, term(inputOutputVariable)],
    [0.4, 0.3, command.variable],
  ],
  newOrExistingVariable: [
    [0.6, 0.1, 'existingVariable'],
    [0.4, 0.2, command.newVariable],
  ],
  expression: [
    [0.6, 0, 'existingVariable'],
    [0.2, 0.2, command.number],
    [0.2, 0.4, 'expression', 'numericTerm', 'expression'],
    [0.1, 0.4, term('('), 'expression', term(')')],
  ],
  numericTerm: [
    [1, 0, term(' + ')],
    [1, 0, term(' - ')],
    [1, 0, term(' * ')],
    [1, 0, term(' / ')],
  ],
} as const);

export type Token = GenericToken<keyof typeof syntaxTree>;
