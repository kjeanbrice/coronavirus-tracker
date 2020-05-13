import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CovidTrackerService } from '../../../core/services/covidtracker.service';
import { Chart } from 'chart.js';
import easydropdown from 'easydropdown';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

    dailyStatsData: any;
    dailyData: any;
    set: Set<string>;
    map: Map<string, number[]>;
    c: Chart;
    edd: any;
    countriesMap: Map<string, any>;
    countries: string[];

    constructor(private covidTrackerService: CovidTrackerService) {
        this.set = new Set();
        this.map = new Map();
        this.map.set('confirmed', []);
        this.map.set('deaths', []);
        this.map.set('dates', []);
        this.countriesMap = new Map<string, {}>();
        this.countries = [];
    }
    ngAfterViewInit(): void {
        this.edd = easydropdown('#countries', {
            behavior: {
                liveUpdates: true,
                loop: true
            },
            callbacks: {
                onSelect: value => {
                    this.selectCountry(value);
                }
            }
        });
    }

    ngAfterViewChecked(): void {
    }

    ngOnInit(): void {
        this.selectCountry('Global');

        this.set.add('getGlobalDailyData');
        this.getGlobalDailyData();

        this.set.add('getAllCountries');
        this.getAllCountries();
    }

    setDailyStatsData(data: any) {
            this.dailyStatsData = data;
            this.dailyStatsData.lastUpdate = new Date(this.dailyStatsData.lastUpdate).toLocaleString();
    }

    async getGlobalDailyData(): Promise<any> {
        try {
            this.dailyData = await this.covidTrackerService.getDailyData();
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.dailyData.length; i++) {
                const item = this.dailyData[i];
                this.map.get('confirmed').push(item.confirmed.total);
                this.map.get('deaths').push(item.deaths.total);
                this.map.get('dates').push(item.reportDate);
            }
            this.loadGlobalLineGraph();
            this.set.delete('getGlobalDailyData');
        } catch (err) {
            console.log(err);
        }
    }

    async getAllCountries(): Promise<any> {
        try {
            const data = await this.covidTrackerService.getAllCountries();
            this.countriesMap.set('Global', {});

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < data.length; i++){
                if (!this.countriesMap.has(data[i].name)) {
                    this.countriesMap.set(data[i].name, {});
                }
            }
            this.countries = Array.from(this.countriesMap.keys());

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (this.countriesMap.has(data[i].name)) {
                    const countryData = await this.getCountryData(data[i].name);
                    if (countryData === null){
                        this.countriesMap.delete(data[i].name);
                    }else{
                        this.countriesMap.set(data[i].name, countryData);
                    }
                }
            }

            this.countries = Array.from(this.countriesMap.keys());
            this.set.delete('getAllCountries');
        } catch (err) {
            console.log(err);
        }
    }

    async getCountryData(country: string): Promise<any>{
        try{
            const data = await this.covidTrackerService.getCountryData(country);
            return data;
        }catch (err){
            return null;
        }
    }

    loadGlobalLineGraph(): void {
        const canvas = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

        if (this.c != null){
            this.c.destroy();
        }
        this.c = new Chart(canvas, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: this.map.get('dates'),
                datasets: [
                    {
                        label: 'Infected',
                        backgroundColor: 'rgba(108,99,255,.4)',
                        borderColor: 'rgba(108,99,255)',
                        data: this.map.get('confirmed'),
                        fill: true
                    },
                    {
                        label: 'Deaths',
                        backgroundColor: 'rgba(203,15,82,.4)',
                        borderColor: 'rgba(203,15,82)',
                        data: this.map.get('deaths'),
                        fill: true
                    },

                ]
            },
            // Configuration options go here
            options: {}
        });
    }


    loadBarGraph(data: any, country: string): void {
        const canvas = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
        if (this.c != null){
            this.c.destroy();
        }

        this.c = new Chart(canvas, {
            // The type of chart we want to create
            type: 'bar',
            data: {
                labels: ['Infected', 'Recovered', 'Deaths'],
                datasets: [{
                    label: 'Current state in ' + country,
                    data: [data.confirmed.value, data.recovered.value, data.deaths.value],
                    backgroundColor: [
                        'rgba(108, 99, 255, 0.3)',
                        'rgba(0, 191, 166, 0.3)',
                        'rgba(203,15,82,0.3)',

                    ],
                    borderColor: [
                        'rgba(108, 99, 255, 1)',
                        'rgba(0, 191, 166, 1)',
                        'rgba(203, 15, 82, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    async selectCountry(country: string) {
        if (country === 'Global'){
            const data = await this.covidTrackerService.fetchGlobalData();
            if (data !== null){
                this.loadGlobalLineGraph();
                this.setDailyStatsData(data);
            }
        }else{
            const data = await this.getCountryData(country);
            if (this.countriesMap.has(country)){
                const countryData = this.countriesMap.get(country);
                const a = new Date(data.lastUpdate).getUTCSeconds();
                const b = new Date(countryData.lastUpdate).getUTCSeconds();
                if (a !== b){
                    this.countriesMap.set(country, data);
                }
            }
            if (data !== null){
                this.loadBarGraph(data, country);
                this.setDailyStatsData(data);
            }
        }
    }
}
