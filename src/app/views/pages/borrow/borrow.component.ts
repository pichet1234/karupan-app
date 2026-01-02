import { NgClass ,CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-borrow',
  standalone: true,
  imports: [
    CommonModule,  
    RouterLink,
    ArchwizardModule,
    NgClass,
    ReactiveFormsModule,
    FeatherIconDirective
  ],
  templateUrl: './borrow.component.html',
  styleUrl: './borrow.component.scss'
})
export class BorrowComponent implements OnInit {

  validationForm1: UntypedFormGroup;
  validationForm2: UntypedFormGroup;
  validationForm3: UntypedFormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;
  isForm3Submitted: Boolean;
  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  
  constructor(public formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
        /**
     * form1 value validation
     */
        this.validationForm1 = this.formBuilder.group({
          firstName : ['', Validators.required],
          lastName : ['', Validators.required],
          phone : ['', Validators.required],
          relation : ['', Validators.required]
        });
    
        /**
         * formw value validation
         */
        this.validationForm2 = this.formBuilder.group({
          borrow_date: [''],
          personid: [''],
          patient:[''],
          userid:[''] ,
          address:[''],
          expenses:[''],
          details: [''],
          remark : ['']
        });
    
        /**
         * form3 value validation
         */
        this.validationForm3 = this.formBuilder.group({
          items: this.formBuilder.array([])
        });
        this.addItem();

        this.isForm1Submitted = false;
        this.isForm2Submitted = false;
        this.isForm3Submitted = false;
  }
  get items(): FormArray {
    return this.validationForm3.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      borrowid: ['test'],
      karupanid: ['test'],
      statuskarupan: ['test'],
      diposit: ['test']
     });
  }
    // เพิ่มแถว
  addItem(): void {
    this.items.push(this.createItem());
  }
    // ลบแถว
  removeItem(index: number): void {
    this.items.removeAt(index);
  }
  submitform3() {
  if (this.validationForm3.valid) {
    console.log(this.validationForm3.value);
    this.wizardForm.goToNextStep(); 
  }
  this.isForm3Submitted = true;
  }
    /**
   * Wizard finish function
   */
    finishFunction() {
      alert('Successfully Completed');
    }
  
    
    /**
     * Returns form
     */
    get form1() {
      return this.validationForm1.controls;
    }
  
  
    /**
     * Returns form
     */
    get form2() {
      return this.validationForm2.controls;
    }
  
        /**
     * Returns form
     */
     get form3() {
          return this.validationForm3.controls;
     }
  
    /**
     * Go to next step while form value is valid
     */
    form1Submit() {
      if(this.validationForm1.valid) {
        this.wizardForm.goToNextStep();
      }
      this.isForm1Submitted = true;
    }
  
  
    /**
     * Go to next step while form value is valid
     */
    form2Submit() {
      if(this.validationForm2.valid) {
        this.wizardForm.goToNextStep();
      }
      this.isForm2Submitted = true;
    }

    /**
     * form 3 
     */
    form3Submit(){

    }
}
