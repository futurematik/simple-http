import 'jest';
import { denormaliseValue, normaliseValue } from './HttpHeaders';

describe('HttpHeaders internals', () => {
  describe('denormaliseValue', () => {
    it('turns a scalar into an array', () => {
      const input = 'one';
      const output = denormaliseValue(input);

      expect(output).toEqual([input]);
    });

    it('leaves an array as-is', () => {
      const input = ['one', 'two', 'three'];
      const output = denormaliseValue(input);

      expect(output).toEqual(input);
    });
  });

  describe('normaliseValue', () => {
    it('turns a single-element array into a scalar', () => {
      const input = ['one'];
      const output = normaliseValue(input);

      expect(output).toEqual(input[0]);
    });

    it('leaves a multi-element array as-is', () => {
      const input = ['one', 'two', 'three'];
      const output = normaliseValue(input);

      expect(output).toEqual(input);
    });

    it('leaves a scalar as-is', () => {
      const input = 'one';
      const output = normaliseValue(input);

      expect(output).toEqual(input);
    });
  });
});
