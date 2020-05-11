import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './content-layout/home/home.component';


const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
