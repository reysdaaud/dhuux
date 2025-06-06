import type { ParsedUrlQuery } from 'querystring';
export declare function searchParamsToUrlQuery(searchParams: URLSearchParams): ParsedUrlQuery;
export declare function urlQueryToSearchParams(query: ParsedUrlQuery): URLSearchParams;
export declare function assign(target: URLSearchParams, ...searchParamsList: URLSearchParams[]): URLSearchParams;
