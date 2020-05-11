import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './components/navbar/navbar.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NavBarComponent],
    providers: [],
    exports: [NavBarComponent]
})
export class SharedModule {
}
