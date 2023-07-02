import { RA } from '../utils/types.ts';

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pickRandom = <T>(array: RA<T>): T =>
  array[random(0, array.length - 1)];

/**
 * Pick random value, with larger values being quadratic more likely.
 * @param {number} max should be larger than 0
 */
export const pickSquared = (max: number): number =>
  max === 1 ? 0 : Math.ceil(Math.sqrt(Math.random() * Math.pow(max, 2))) - 1;
