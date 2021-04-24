import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(
    private http: HttpClient
  ) { }

    loadData(opt)
    {
      switch(opt.method)
      {
        case "GET":
          let headers = {headers: new HttpHeaders()}
          if(opt.params)
          {
            headers['params'] = new HttpParams().append(opt.params['key'], opt.params['value']);
          }
          return this.http.get(opt.url, headers);
        default:
          break;
      }
    }
}
