import {Component, OnInit} from '@angular/core';
import {CovidTrackerService} from '../../../core/services/covidtracker.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    defaultData: any;
    set: Set<string>;

    constructor(private http: CovidTrackerService){
        this.set = new Set();
    }

    ngOnInit(): void{

        this.set.add('getDefaultData');
        this.getDefaultData();
    }

    async getDefaultData(): Promise<any>{
        try{
            this.defaultData = await this.http.fetchData();
            this.defaultData.lastUpdate = new Date(this.defaultData.lastUpdate).toLocaleString();
            this.set.delete('getDefaultData');
        } catch (err){
            console.log('Error retrieving default data');
        }
    }
}
