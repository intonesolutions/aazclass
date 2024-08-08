import { Component, OnInit, ChangeDetectorRef, ApplicationRef, createComponent, ComponentRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { apiClient } from '../../service/apiClient';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { DomSanitizer } from '@angular/platform-browser';
declare const Math: any;
declare const moment: any;
declare const isNaN: any;

@Component({
  selector: 'app-base-component',
  template: ``,
  styles: [
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class BaseComponentComponent implements OnInit {

  public Math: any = Math;
  public moment: any = moment;
  public isNaN: any = isNaN;
  public static _authuser:any={};
  public user:any={}; // public user..used for e-commerce
  // authenticated user .. used for internal portals
  public get authuser(){
    return BaseComponentComponent._authuser;
  } 
  public set authuser(u:any){
    BaseComponentComponent._authuser=u;
  }
  public formater: any = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  constructor(public apic: apiClient, public route: ActivatedRoute, public router: Router,
    public cdr: ChangeDetectorRef, public appRef: ApplicationRef,
    public authService: MsalService, public msalBroadcastService: MsalBroadcastService,public sanitizer: DomSanitizer) {
    // init the modalPopup
    const host = document.getElementById('dynacomps') as Element;
    const environmentInjector = this.appRef.injector;
  }
  public isDate(val: any) {
    if (!val)
      return false;
    let sval = val + '';
    let b = isNaN(val) && sval.indexOf(' GMT') > 0 && moment(sval)._isValid;
    return b;
  }
  public redraw() {
    this.cdr.detectChanges();
  }
  async ngOnInit() {
    let s=localStorage.getItem('currentuser');
    if(s)
      this.user=JSON.parse(s);
    else
      this.user={};

    s=localStorage.getItem('authuser');
    if(s)
      this.authuser=JSON.parse(s);
    else
      this.authuser={};
  }
  public saveUser()
  {
    let s=JSON.stringify(this.user);
    localStorage.setItem('currentuser',s);
  }
  public saveAuthUser()
  {
    let s=JSON.stringify(this.authuser);
    localStorage.setItem('authuser',s);
  }
  public flattenObj(ob: any): any {
    if (Array.isArray(ob)) {
      let output = [];
      for (let item of ob) {
        let newitem = this.flattenObj(item);
        output.push(newitem);
      }
      return output;
    }
    // The object which contains the
    // final result
    let result :any= {};
    // loop through the object "ob"
    for (const i in ob) {

      // We check the type of the i using
      // typeof() function and recursively
      // call the function again
      if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
        const temp = this.flattenObj(ob[i]);
        for (const j in temp) {

          // Store temp in result
          result[i + '.' + j] = temp[j];
        }
      }

      // Else store ob[i] in result directly
      else {
        result[i] = ob[i];
      }
    }
    return result;
  };
}
