import { AnyRouter } from '../../core';
import { FetchHandlerOptions } from './types';
export type FetchHandlerRequestOptions<TRouter extends AnyRouter> = FetchHandlerOptions<TRouter> & {
    req: Request;
    endpoint: string;
};
export declare function fetchRequestHandler<TRouter extends AnyRouter>(opts: FetchHandlerRequestOptions<TRouter>): Promise<Response>;
//# sourceMappingURL=fetchRequestHandler.d.ts.map