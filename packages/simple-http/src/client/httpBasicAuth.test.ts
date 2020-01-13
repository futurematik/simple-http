import 'jest';
import { httpBasicAuth } from './httpBasicAuth';

describe('httpBasicAuth', () => {
  it('correctly encodes username and password', () => {
    const token = httpBasicAuth('Aladdin', 'OpenSesame');
    expect(token).toEqual('Basic QWxhZGRpbjpPcGVuU2VzYW1l');
  });
});
