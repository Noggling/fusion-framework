import { IContextConfigurator, ContextConfigurator } from './configurator';
//import { ITelemetryProvider, TelemetryProvider } from './provider';
import type { Module } from '@equinor/fusion-framework-module';
import { ContextProvider } from 'provider';
import { HttpModule } from '@equinor/fusion-framework-module-http';
import { ServiceDiscoveryModule } from '@equinor/fusion-framework-module-service-discovery';

export type ContextModule = Module<
    'context',
    ContextProvider,
    IContextConfigurator,
    [HttpModule, ServiceDiscoveryModule]
>;

export const module: ContextModule = {
    name: 'context',
    configure: () => new ContextConfigurator(),
    initialize: (config): ContextProvider => {
        return new ContextProvider(config.context);
    },
    postInitialize: async (modules, config) => {
        if (config.http.hasClient('context')) {
            console.debug('ContextModule::postInitialize Http already configured');
        }
        const service = await modules.serviceDiscovery.resolveService('context');
        if (!service) {
            throw Error('failed to resolve services context');
        }
        config.http.configureClient('context', {
            baseUri: service.uri,
            onCreate: (client) => {
                client.defaultScope = service.defaultScopes;
            },
        });
    },
};

export default module;

declare module '@equinor/fusion-framework-module' {
    interface Modules {
        context: ContextModule;
    }
}
