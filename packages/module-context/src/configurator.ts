export declare enum ContextTypes {
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

type ContextConfig = {
    types: ContextTypes[];
};

export interface IContextConfigurator {
    addConfig(name: string, config: ContextConfig): void;
    getConfig(name: string): ContextConfig;
}

export class ContextConfigurator implements IContextConfigurator {
    protected _configs: Record<string, ContextConfig> = {};

    addConfig(name: string, config: ContextConfig): void {
        this._configs[name] = config;
    }

    getConfig(name: string): ContextConfig {
        return this._configs[name];
    }
}
