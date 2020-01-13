import 'jest';
import { tokenAuth } from './tokenAuth';

describe('tokenAuth', () => {
  it('defaults to Bearer token', () => {
    const result = tokenAuth('token_goes_here');

    expect(result).toEqual('Bearer token_goes_here');
  });

  it('supports alternative schemes', () => {
    const result = tokenAuth('token_goes_here', 'some_other_scheme');

    expect(result).toEqual('some_other_scheme token_goes_here');
  });
});
