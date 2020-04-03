import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { dareAnimations } from '@dare/animations';
import { Customer } from 'app/+customers/slice-of-state/customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  animations   : dareAnimations,
  encapsulation: ViewEncapsulation.None
})
export class CustomerFormComponent implements OnChanges, OnDestroy {

  @Input() customer: Customer;
  @Output() customerChange = new EventEmitter<{ customer: Customer; valid: boolean }>();
  formGroup: FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.customer && changes.customer.currentValue) {
      this.formGroup.patchValue(this.customer);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      catchPhrase: [null, Validators.required],
      isActive: [true]
    });

    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.customerChange.emit({
        customer: {
          ...this.customer,
          ...value
        },
        valid: this.formGroup.valid
      });
    });
  }
}
