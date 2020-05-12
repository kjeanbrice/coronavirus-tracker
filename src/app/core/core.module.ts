import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CovidTrackerService} from './services/covidtracker.service';

@NgModule({
    imports: [CommonModule],
    exports: [],
    providers: [CovidTrackerService],
    declarations: []
})
export class CoreModule{
}
