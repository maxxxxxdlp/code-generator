import { RA } from '../utils/types.ts';
import { Context, inputOutputVariable, syntaxTree, Token } from './syntax.ts';
import { error } from '../utils/utils.ts';

type CodeGeneratorConfig = {
  readonly softTokenLimit: number;
};

const defaultConfig: CodeGeneratorConfig = {
  softTokenLimit: 100,
};

/**
 * Randomly generate a syntactically valid JavaScript code (unindented) using a provided soft token count limit
 */
export function generateCode(
  config: CodeGeneratorConfig = defaultConfig
): RA<string> {
  const { softTokenLimit } = config;

  let context: Context = {
    output: [],
    scopes: [[inputOutputVariable]],
    explorationRate: 1,
  };
  const queue: Token[] = [Object.keys(syntaxTree)[0]];

  while (queue.length > 0) {
    context = {
      ...context,
      // Gradually become more conservative as length limit is approached
      explorationRate: Math.max(0, 1 - context.output.length / softTokenLimit),
    };

    const token = queue.shift()!;
    if (typeof token === 'string') {
      const paths = syntaxTree[token];

      const { sum, weights } = sumWeights(
        paths.map(
          ([priority, exploration]) =>
            // More exploratory paths are becoming less likely as exploration rate decreases
            priority * (1 - exploration * (1 - context.explorationRate))
        )
      );

      const random = Math.random() * sum;
      const index =
        weights.findIndex((priority) => random < priority) ??
        weights.length - 1;
      const [_priority, _exploration, ...declaration] = paths[index];
      queue.unshift(...declaration);
    } else if (typeof token === 'function') {
      const { context: newContext, output: newOutput } = token(context);
      context = { ...context, ...newContext };
      context.output.push(
        ...(Array.isArray(newOutput) ? newOutput : [newOutput])
      );
    } else if (typeof token === 'object') context.output.push(token.term);
    else error('Unknown token type', { token, context, queue });
  }

  return context.output.join('').split('\n');
}

/**
 * @example
 * sumWeights([0.6,0.3,0.2]) // Outputs:
 * { sum: 1.1, weights: [0.6, 0.9, 1.1] }
 */
const sumWeights = (
  weights: RA<number>
): { readonly sum: number; readonly weights: RA<number> } =>
  weights.reduce<{ readonly sum: number; readonly weights: RA<number> }>(
    ({ sum, weights }, weight) => ({
      sum: sum + weight,
      weights: [...weights, sum + weight],
    }),
    { sum: 0, weights: [] }
  );
