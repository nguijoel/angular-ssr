import { APP_ID, Inject, Injectable } from '@angular/core';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable({ providedIn: 'root' })
export class CoreServerService {
    private $isProduction?: boolean;
    private $distFolder?: string;

    constructor(@Inject(APP_ID) private appId: string) {}

    get distFolder(): string { 
       
        if(!this.$distFolder)
        {

            this.$distFolder = join(process.cwd(), "../browser");
            
            this.$isProduction = existsSync(this.$distFolder);

            if(!this.$isProduction) 
            {
                this.$distFolder = join(process.cwd(),'dist', this.appId, 'browser');
            }
        }

        return this.$distFolder;
    }
}
