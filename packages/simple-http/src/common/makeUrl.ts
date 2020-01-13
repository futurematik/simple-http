import { join, resolve } from 'path';
import { URL, URLSearchParams } from 'url';

export interface UrlParams {
  [key: string]: string | string[] | undefined;
}

export interface UrlComponents {
  authority?: string;
  fragment?: string | UrlParams;
  query?: string | UrlParams;
  path?: string | string[];
  scheme?: string;
}

export function makeUrl(
  { authority, fragment, path, query, scheme }: UrlComponents,
  base?: string,
) {
  let url = '';
  if (scheme && authority) {
    url += scheme + ':';
  }
  if (authority) {
    url += '//' + authority;
  }
  if (path) {
    if (Array.isArray(path)) {
      path = join(...path);
    }
    if (authority) {
      path = resolve('/', path);
    }
    url += path;
  }
  if (query) {
    if (typeof query !== 'string') {
      query = new URLSearchParams(query).toString();
    }
    url += '?' + query;
  }
  if (fragment) {
    if (typeof fragment !== 'string') {
      fragment = new URLSearchParams(fragment).toString();
    }
    url += '#' + fragment;
  }
  if (base) {
    return new URL(url, base).toString();
  }
  return url;
}
