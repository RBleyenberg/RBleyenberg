import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatButtonToggle, MatSort } from '@angular/material';
import { dareAnimations } from '@dare/animations';
import { Customer } from 'app/+customers/slice-of-state/customer.model';

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrls: ['./customers-table.component.scss'],
  animations   : dareAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CustomersTableComponent implements OnChanges, OnInit, AfterViewInit {

  @Input() customers: Customer[];
  @Input() filter: string;
  @Output() delete = new EventEmitter<Customer>();
  @Output() edit = new EventEmitter<Customer>();

  @ViewChild('group', { static: false }) toggle: MatButtonToggle;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  

  columnsToDisplay = ['name'];
  dataSource = new MatTableDataSource();

  constructor() {
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.customers && simpleChanges.customers.currentValue) {
      this.dataSource.data = this.customers;
    }
    this.dataSource.filter = this.filter;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
