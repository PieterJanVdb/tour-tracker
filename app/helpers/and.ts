import { helper } from '@ember/component/helper';

const and = (params: any[]): boolean => {
  let result = true;
  params.forEach(param => {
    result = result && param;
  });
  return result;
};

export default helper(and);
