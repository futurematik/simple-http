import 'jest';
import { foldHeaders } from './foldHeaders';

describe('foldHeaders', () => {
  it('collapses arrays to comma-seperated strings', () => {
    const headers = {
      one: ['a', 'b', 'c'],
      two: '42',
      three: ['d'],
    };

    const result = foldHeaders(headers);

    expect(result).toEqual({
      one: 'a, b, c',
      two: '42',
      three: 'd',
    });
  });
});
