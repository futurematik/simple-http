import 'jest';
import { parseHeaderParams } from './parseHeaderParams';

describe('parseHeader', () => {
  it('parses a valid header correctly', () => {
    const input = 'application/json; charset=utf-8; foo=bar; answer=42';

    const [value, params] = parseHeaderParams(input);

    expect(value).toEqual('application/json');
    expect(params).toEqual({
      charset: 'utf-8',
      foo: 'bar',
      answer: '42',
    });
  });
});
