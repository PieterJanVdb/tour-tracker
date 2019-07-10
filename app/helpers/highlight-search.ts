import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
import { SafeString } from '@ember/string/-private/handlebars';

/**
 * Highlight the search value in the result by
 * wrapping it in a span with class 'highlight'
 * @param {Array<result/search>}
 */
const highlight = ([result, search]: [string, string]): SafeString => {
  const searchRegex = new RegExp(search, 'gi');
  const [match] = result.match(searchRegex) || [result];
  return htmlSafe(result.replace(searchRegex, `<span class="highlight">${match}</span>`));
};

export default helper(highlight);
