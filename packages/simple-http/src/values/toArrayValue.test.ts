import 'jest';
import { toArrayValue } from './toArrayValues';

describe('toArrayValue', () => {
  it('turns a scalar into an array', () => {
    const input = 'one';
    const output = toArrayValue(input);

    expect(output).toEqual([input]);
  });

  it('leaves an array as-is', () => {
    const input = ['one', 'two', 'three'];
    const output = toArrayValue(input);

    expect(output).toEqual(input);
  });
});
