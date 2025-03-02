import { AuthConfigurator, IAuthConfigurator } from './configurator';
import { AuthProvider, IAuthProvider } from './provider';

import type { Module, ModulesConfigType } from '@equinor/fusion-framework-module';
import type { HttpMsalModule } from '@equinor/fusion-framework-module-http';

export type MsalModule = Module<'auth', IAuthProvider, IAuthConfigurator, [HttpMsalModule]>;

export const module: MsalModule = {
    name: 'auth',
    configure: (refModules) => {
        const configurator = new AuthConfigurator();
        /** check if parent scope has configured msal */
        if (refModules?.auth?.defaultConfig) {
            /** copy configuration from parent scope */
            configurator.configureDefault(refModules.auth.defaultConfig);
        }
        return configurator;
    },
    initialize: async ({ config, requireInstance }) => {
        const authProvider = new AuthProvider(config);
        try {
            const httpModule = await requireInstance('http');
            httpModule.defaultHttpRequestHandler.set('MSAL', async (request) => {
                const { scopes = [] } = request;
                if (scopes.length) {
                    /** TODO should be try catch, check caller for handling */
                    const token = await authProvider.acquireToken({
                        scopes,
                    });
                    if (token) {
                        const headers = new Headers(request.headers);
                        headers.set('Authorization', `Bearer ${token.accessToken}`);
                        return { ...request, headers };
                    }
                }
            });
        } catch (err) {
            // TODO
            console.error(err);
        }
        return authProvider;
    },
};

export const setupMsalModule = (
    config: ModulesConfigType<[MsalModule]>,
    callback: (config: IAuthConfigurator) => void
): void | Promise<void> => {
    callback(config.auth);
};

declare module '@equinor/fusion-framework-module' {
    interface Modules {
        auth: MsalModule;
    }
}

export default module;
