import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { StarWarItems, StarWarsApiResponse, StarWarsTable } from '../models/star-wars.model';
import { HomePageService } from '../services/home-page.service';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy, OnInit {
  starWarsSearchForm!: UntypedFormGroup;
  searchControl = new FormControl();
  displayedColumns = ['name', 'height', 'birth_year'];
  dataSource = new MatTableDataSource<StarWarsTable>();
  staWarsItemsArray: StarWarItems[] = [];
  loading = true;
  noItemsFound = false;
  searchLoading = false;
  subscription!: Subscription;

  @ViewChild('search') searchElement?: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(private readonly homePageService: HomePageService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getTableData();
  }

  buildForm() {
    this.starWarsSearchForm = new UntypedFormGroup({
      searchControl: new UntypedFormControl('')
    })
  }

  getTableData(searchText?: string) {
    if (searchText) this.searchLoading = true;
    this.subscription = this.homePageService.getStarWarList(searchText).subscribe({
      next: (resp: StarWarsApiResponse) => { this.processData(resp) },
      error: (e) => {
        console.error(e);
        this.noResultsFound();
      }
    })
  }

  processData(resp: StarWarsApiResponse) {
    let dataSrcArray: StarWarsTable[] = [];
    if (resp && resp.results && resp.results.length > 0) {
      this.noItemsFound = false;
      this.searchLoading = false;
      this.loading = false;
      this.staWarsItemsArray = resp.results.sort((a, b) => a.name.localeCompare(b.name));;
      this.staWarsItemsArray.forEach((item, ind, arr) => {
        dataSrcArray.push({ name: item.name, height: item.height, birth_year: item.birth_year });
        if (ind === arr.length - 1) {
          this.dataSource.data = dataSrcArray;
          this.setFocus();
          this.setTableAttributes();
        }
      });
    } else this.noResultsFound();
  }

  noResultsFound() {
    this.searchLoading = false;
    this.loading = false;
    this.noItemsFound = true;
    this.staWarsItemsArray = [];
    this.dataSource.data = [];
  }

  setTableAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setFocus() {
    setTimeout(() => {
      this.searchElement && this.searchElement.nativeElement && this.searchElement.nativeElement.focus();
    }, 0);
  }

  clearSearch() {
    this.starWarsSearchForm.reset();
    this.getTableData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
