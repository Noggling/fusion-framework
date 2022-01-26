import { IHttpClient } from '@equinor/fusion-framework-module-http';
import buildQuery from 'odata-query';

export enum ContextTypes {
    Contract = 'Contract',
    OrgChart = 'OrgChart',
    PDP = 'PDP',
    PimsDomain = 'PimsDomain',
    Portfolio = 'Portfolio',
    Project = 'Project',
    ProjectMaster = 'ProjectMaster',
    Facility = 'Facility',
    TpdPortfolio = 'TpdPortfolio',
}

type ParentContext = {
    id: string;
    type: ContextTypes;
};

export type Context = {
    id: string;
    externalId: string | null;
    type: ContextTypes;
    title: string;
    value: any;
    isActive: boolean;
    parent: ParentContext;
};

export const getContext =
    (client: IHttpClient) =>
    (query: string, ...types: ContextTypes[]) => {
        const oDataQuery = buildQuery({
            filter: {
                type: { in: types },
            },
            search: query,
        });
        client.fetch('/context?' + oDataQuery);
    };
