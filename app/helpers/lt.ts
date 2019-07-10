import { helper } from '@ember/component/helper';

const lt = ([a, b]: [number, number]): boolean => a < b;

export default helper(lt);