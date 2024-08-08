import { Component, OnInit } from '@angular/core';
import {BaseComponentComponent} from '../../shared/base-component/base-component.component';
import { apiClient } from 'src/app/service/apiClient';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponentComponent implements OnInit {
  session:string='';
  
  messages:string='';
  inputmessage:string='';

  override async ngOnInit() {
    await super.ngOnInit();
    let r=await this.apic.callAPIMethodPOST('chat.start', null, {name:'captain majed',username:'Lyan',language:'arabic',
      instructions:`انت خبير في الحساب و الرياضيات `
     });
     this.session=r.data;
     this.messages=r.message;
  }
  async send(){
    this.messages=this.messages+'<br/>-----from me--------<br/>' + this.inputmessage;
    let m=await this.apic.callAPIMethodPOST('chat.chat', null, {session:this.session,message:this.inputmessage});
    this.messages=this.messages+'<br/>-----from robot--------<br/>' + m.data;
    this.inputmessage='';
  }

}
