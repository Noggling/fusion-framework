import { IContextConfigurator } from 'configurator';
import { IHttpClient } from '@equinor/fusion-framework-module-http';
import { getContext } from './api/get-context';

export interface IContextProvider {}

export class ContextProvider {
    constructor(protected _configurator: IContextConfigurator, protected _client: IHttpClient) {}

    getContext(name: string) {
        const config = this._configurator.getConfig(name);
        const context = getContext(this._client)('', ...config.types);
        return context; //remove this
    }
}
