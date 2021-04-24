import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'

import { ApiServicesService } from '../api-services.service'
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  genreData: any = {};
  constructor(
    private route: ActivatedRoute,
    private api: ApiServicesService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.genreData.genreName = this.route.snapshot.paramMap.get('name');
    this.genreData.searchKeyword = '';
    this.genreData.loader = false;
    this.apiCalls({case: 'getBooks'});
    this.search();
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    this.genreData.loader = true;
    let scrollEvent = fromEvent(document, 'scroll')
    this.http.get(this.genreData.bookResponse.next).pipe(
      takeUntil(scrollEvent)
    ).subscribe( resp=>{
      this.genreData.bookResponse.next = resp['next'];
            resp['results']
            .filter(eachBook => {
              return (Object.keys(eachBook.formats).includes('image/jpeg'))
            })
            .forEach(
              each=>{
                this.genreData.bookResponse.results.push(each);
              }
            )
            this.genreData.loader = false;
    })
    
  }

  search()
  {
    let this_ = this;
    let element = document.getElementById('search-box');
    let keyStrokes = fromEvent(element, 'keyup');
    let observable = keyStrokes.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(function(value)
      {
        return this_.api.loadData({method: 'GET', params: {key: 'search', value: this_.genreData.searchKeyword}, url: 'http://skunkworks.ignitesol.com:8000/books/'});
      })
    );

    observable.subscribe(
      resp=>{
        this.genreData.bookResponse = resp;
        this.genreData.bookResponse.results = resp['results'].filter(
          eachBook => {
            return (Object.keys(eachBook.formats).includes('image/jpeg'))
          }
        );
        if(this.genreData.bookResponse.next === null)
          {
            this.genreData.loader = false;
          }
      }
    )
  }
  apiCalls(opt)
  {
    switch(opt.case)
    {
      case "getBooks":
        opt.url = 'http://skunkworks.ignitesol.com:8000/books/';
        opt.method = 'GET'
      break;
      case "getMoreBooks":
        opt.url = this.genreData.bookResponse.next;
        opt.method = 'GET'
        break
    }
    this.loadGutenberg(opt);
  }

  loadGutenberg(opt)
  {
    this.api.loadData(opt).subscribe(
      resp => {
      switch(opt.case)
      {
        case "getBooks":
          this.genreData.bookResponse = resp
          this.genreData.bookResponse.results = resp['results'].filter(
            eachBook => {
              return (Object.keys(eachBook.formats).includes('image/jpeg'))
            }
          );
          break;
        case "getMoreBooks":
            this.genreData.bookResponse.next = resp['next'];
            resp['results'].forEach(
              each=>{
                this.genreData.bookResponse.results.push(each);
              }
            );
            if(this.genreData.bookResponse.next == null)
            {
              this.genreData.loader = false;
            }
          break;
        default:
          console.log(opt);
          break;
      }
      }
    )
  }
  handler(opt)
  {
    switch(opt.case)
    {
      case "clearSearch":
        this.genreData.searchKeyword = '';
        this.apiCalls({case: 'getBooks'});
        break;
      default:
        console.log(opt)
        break;
    }
  }
  openBook(book)
  {
    let path = Object.keys(book.formats).filter(
      key=>{
        if(book.formats[key].endsWith('.pdf') || book.formats[key].endsWith('.htm') || book.formats[key].endsWith('.html') || book.formats[key].endsWith('.txt')) return key;
      }
    )
    if(path.length)
    {
      window.open(book.formats[path[0]]);
    }
    else
    {
      this.router.navigate(['home'])
    }
  }
  trackByEmpCode(index: number, employee: any): string {
    return employee.code;
}
}
