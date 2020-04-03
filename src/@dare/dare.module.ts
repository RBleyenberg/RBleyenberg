import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { DARE_CONFIG } from '@dare/services/config.service';

@NgModule()
export class DareModule
{
    constructor(@Optional() @SkipSelf() parentModule: DareModule)
    {
        if ( parentModule )
        {
            throw new Error('DareModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders
    {
        return {
            ngModule : DareModule,
            providers: [
                {
                    provide : DARE_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
