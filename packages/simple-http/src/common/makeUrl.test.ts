import 'jest';
import { makeUrl } from './makeUrl';

describe('makeUrl', () => {
  it('makes a full URL', () => {
    const url = makeUrl({
      scheme: 'https',
      authority: 'localhost:8080',
      path: 'foo/bar',
      query: { one: '1', two: '2' },
      fragment: { three: '3', four: '4' },
    });

    expect(url).toEqual(
      'https://localhost:8080/foo/bar?one=1&two=2#three=3&four=4',
    );
  });

  it('makes a scheme relative URL', () => {
    const url = makeUrl({
      authority: 'localhost:8080',
      path: 'foo/bar',
      query: { one: '1', two: '2' },
      fragment: { three: '3', four: '4' },
    });

    expect(url).toEqual('//localhost:8080/foo/bar?one=1&two=2#three=3&four=4');
  });

  it('makes a host relative URL', () => {
    const url = makeUrl({
      path: 'foo/bar',
      query: { one: '1', two: '2' },
      fragment: { three: '3', four: '4' },
    });

    expect(url).toEqual('foo/bar?one=1&two=2#three=3&four=4');
  });

  it('makes a fragment relative URL', () => {
    const url = makeUrl({
      fragment: { three: '3', four: '4' },
    });

    expect(url).toEqual('#three=3&four=4');
  });

  it('makes an absolute URL when given a base', () => {
    const url = makeUrl(
      {
        fragment: { three: '3', four: '4' },
      },
      'https://www.google.com/?q=hello',
    );

    expect(url).toEqual('https://www.google.com/?q=hello#three=3&four=4');
  });
});
