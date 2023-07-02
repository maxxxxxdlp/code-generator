import { RA } from './types.ts';

const getMedia = (query: string): boolean =>
  globalThis.matchMedia(query).matches;

/** @remarks Not reactive to keep it simple */
export const isDarkMode = getMedia('(prefers-color-scheme: dark)');

export const replaceItem = <T>(
  array: RA<T>,
  index: number,
  newItem: T
): RA<T> =>
  array[index] === newItem
    ? array
    : [
        ...array.slice(0, index),
        newItem,
        ...(index === -1 ? [] : array.slice(index + 1)),
      ];

/** Create a new array without a given item */
export const removeItem = <T>(array: RA<T>, index: number): RA<T> =>
  index < 0
    ? [...array.slice(0, index - 1), ...array.slice(index)]
    : [...array.slice(0, index), ...array.slice(index + 1)];

export const capitalize = <T extends string>(string: T): Capitalize<T> =>
  (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<T>;

export function error(message: string, ...args: RA<unknown>): never {
  console.error(message, ...args);
  if (process.env.NODE_ENV === 'development') debugger;
  throw new Error(message);
}

// Find a value in an array, and return it's mapped variant
export function mappedFind<ITEM, RETURN_TYPE>(
  array: RA<ITEM>,
  callback: (item: ITEM, index: number) => RETURN_TYPE | undefined
): RETURN_TYPE | undefined {
  let value = undefined;
  array.some((item, index) => {
    value = callback(item, index);
    return value !== undefined;
  });
  return value;
}

export function parseNumber(value: string): number | undefined {
  const number = Number.parseInt(value);
  return Number.isNaN(number) ? undefined : number;
}
