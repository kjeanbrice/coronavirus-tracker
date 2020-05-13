import {Injectable} from '@angular/core';
import axios from 'axios';
import {AxiosInstance} from 'axios';

@Injectable({
    providedIn: 'root'
})
export class CovidTrackerService{
    private DEFAULT_URL = 'https://covid19.mathdro.id/api';
    private DAILY_DATA_URL = 'https://covid19.mathdro.id/api/daily';
    private COUNTRIES_URL = 'https://covid19.mathdro.id/api/countries';


    private Axios: AxiosInstance;
    constructor(){
        this.Axios = axios.create({
            timeout: 3000
        });
    }

    async fetchDataByUrl(url: string): Promise<any>{
        try{
            const res = await this.Axios.get(url);
            return res.data;
        }catch (err){
            return Promise.reject(err);
        }
    }

    async fetchGlobalData(): Promise<any> {
        try{
            const res = await this.Axios.get(this.DEFAULT_URL);
            return res.data;
        }catch (err){
            return Promise.reject(err);
        }
    }

    async getAllCountries(){
        try{
            const result = await this.fetchDataByUrl(this.COUNTRIES_URL);
            return result.countries;
        }catch (err){
            return Promise.reject(err);
        }
    }

    async getCountryData(country: string){
        try{
            const result = await this.fetchDataByUrl(this.COUNTRIES_URL + '/' + country);
            return result;
        }catch (err){
            return Promise.reject(err);
        }
    }

    async getDailyData(): Promise<any>{
        try{
            const res = await (await this.Axios.get(this.DAILY_DATA_URL));
            return res.data;
        }catch (err){
            return Promise.reject(err);
        }
    }
}
