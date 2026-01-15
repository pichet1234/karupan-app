import { NgClass ,CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ArchwizardModule } from '@rg-software/angular-archwizard';
import { WizardComponent as BaseWizardComponent } from '@rg-software/angular-archwizard';
import { FeatherIconDirective } from '../../../core/feather-icon/feather-icon.directive';
import { ApiDataService } from '../../../core/services/api-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressService ,TambonData, MooData } from '../../../core/services/address.service';
import Swal from 'sweetalert2';

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

  karupanborrow: any[] = [];//เก็บข้อมูลครุภัณฑ์ที่สามารถยืมได้

  tambons: TambonData[] = [];// ตำบล
  villages: MooData[] = [];// หมู่บ้าน
  moos: string[] = []; // หมู่ที่
  imgU:any; //เก็บภาพครุภัณฑ์ที่เลือกยืม
  personid:any;//เก็บรหัสบผู้ยืม
  borwid:any;//เก็บรหัสการยืม

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  
  constructor(
              public formBuilder: UntypedFormBuilder, 
              private apiDataService: ApiDataService, 
              private modalService:NgbModal,
              private addressService: AddressService) {}

  // --------------------ส่วน Modal แสดงครุภัณฑ์ที่สามารถยืมได้ ---------------------
     openXlModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }

  chooseItem(item:any){
    console.log(item);
  }
  ngOnInit(): void {
        /**
     * form1 value validation
     */
        this.validationForm1 = this.formBuilder.group({
          fname : ['', Validators.required],
          lname : ['', Validators.required],
          phone : ['', Validators.required],
          relation : ['', Validators.required]
        });
    
        /**
         * formw value validation
         */
        this.validationForm2 = this.formBuilder.group({
          borrow_date: ['' ,Validators.required],
          personid: [''],
          patient:['' , Validators.required],
          userid:[''] ,
          expenses:[''],
          details: [''],
          remark : [''],
          bannumber: [''],
          tambon: [''],
          village: [{ value: '', disabled: true },Validators.required],
          moo: [{ value: '', disabled: true },Validators.required]
        });
            this.tambons = this.addressService.getTambons();

    this.validationForm2.get('tambon')?.valueChanges.subscribe(val => {
      this.villages = this.addressService.getVillagesByTambon(val);
      this.validationForm2.get('village')?.reset();
      this.validationForm2.get('village')?.enable();
      this.moos = [];
      this.validationForm2.get('moo')?.reset();
      this.validationForm2.get('moo')?.disable();
    });
    this.validationForm2.get('village')?.valueChanges.subscribe(val => {
      const tambon = this.validationForm2.get('tambon')?.value;
      this.moos = this.addressService.getMooByVillage(tambon, val);
      this.validationForm2.get('moo')?.reset();
      this.validationForm2.get('moo')?.enable();
    });

        /**
         * form3 value validation
         */
        this.validationForm3 = this.formBuilder.group({
          items: this.formBuilder.array([])
        });


        this.isForm1Submitted = false;
        this.isForm2Submitted = false;
        this.isForm3Submitted = false;
        this.loadkarupanborrow();
  }
  get items(): FormArray {
    return this.validationForm3.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      borrowid: this.borwid,
      karupanid: ['test'],
      kname: [''],
      karupuncode: [''],
      statuskarupan: ['test'],
      diposit: [0]
     });
  }
    // เพิ่มแถว
  addItem(item: any): void {
    this.items.push(this.createItem());
    this.items.at(this.items.length - 1).patchValue({
      karupanid: item._id,
      kname: item.kname,
      karupuncode: item.karupanCode,
      statuskarupan: 'ยืมแล้ว',
      diposit: item.diposit
    });
    this.imgU=item.imageUrl;
    console.log(this.validationForm3.value);

    this.modalService.dismissAll();
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

  loadkarupanborrow() {
    // ดึงข้อมูลครุภัณฑ์ที่สามารถยืมได้
    this.apiDataService.getkarupanborrow().subscribe({ 
      next: (res)=>{
        this.karupanborrow = res.data;
      },
      error: (err)=>{
        console.error(err);
      }
     });
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
        this.apiDataService.addPersonnel(this.validationForm1.value).subscribe({ 
          next: (res)=>{
            this.personid = res.data._id;
            this.validationForm2.patchValue({ personid: this.personid }); // set personid in form2
            Swal.fire({
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500
            });
          },error: (err)=>{
            console.error(err);
          }
        });
        this.wizardForm.goToNextStep();
      }
      this.isForm1Submitted = true;
    }
  
  
    /**
     * Go to next step while form value is valid
     */
    form2Submit() {
      if(this.validationForm2.valid) {
        this.apiDataService.addBorrow(this.validationForm2.value).subscribe({
          next: (res)=>{
            this.borwid = res.data._id;
            this.validationForm3.patchValue({ borrowid: this.borwid }); // set borrowid in form3
            Swal.fire({
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500
            });
          },error: (err)=>{
            console.error(err);
          }
        });
        this.wizardForm.goToNextStep();
      }
      this.isForm2Submitted = true;
    }

    /**
     * form 3 
     */
    form3Submit(){

      if(this.borwid){
        this.apiDataService.addBorrowDetail(this.validationForm3.value).subscribe({
          next: (res)=>{
            Swal.fire({
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500
            });
          },error: (err)=>{
            console.error(err);
          }
        });
        this.wizardForm.goToNextStep();
        this.isForm3Submitted = true;
      }else{
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถบันทึกข้อมูลได้',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(this.borwid);
      }
      

    }
}
