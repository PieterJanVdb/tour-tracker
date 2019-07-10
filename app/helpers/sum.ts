import { helper } from '@ember/component/helper';

const sum = ([a, b]: [number, number]): number => a + b;

export default helper(sum);