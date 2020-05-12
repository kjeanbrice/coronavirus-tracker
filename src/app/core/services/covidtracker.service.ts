import {Injectable} from '@angular/core';
import axios from 'axios';
import {AxiosInstance} from 'axios';

@Injectable({
    providedIn: 'root'
})
export class CovidTrackerService{
    private DEFAULT_URL = 'https://covid19.mathdro.id/api';


    private Axios: AxiosInstance;
    constructor(){
        this.Axios = axios.create({
            timeout: 3000
        });
    }

    async fetchDataByUrl(url: string): Promise<any>{
        await this.Axios.get(url).then((response) => {
            return response;
        }).catch((error) => {
            console.log('Error: fetchDataByUrl');
            return Promise.reject(error);
        });
    }

    async fetchData(): Promise<any> {
        try{
            const res = await this.Axios.get(this.DEFAULT_URL);
            return res.data;
        }catch (err){
            return Promise.reject(err);
        }
    }
}
