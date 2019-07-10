import { helper } from '@ember/component/helper';

const lt = ([a, b]: [any, any]): boolean => a === b;

export default helper(lt);