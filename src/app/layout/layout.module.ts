import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutRoutingModule} from './layout-routing.module';
import {HomeComponent} from './content-layout/home/home.component';
import {SharedModule} from '../shared/shared.module';
import {CountUpModule} from 'ngx-countup';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        RouterModule,
        SharedModule,
        CountUpModule
    ],
    declarations: [HomeComponent],
    providers: [],
    exports: [HomeComponent]
})
export class LayoutModule {
}
