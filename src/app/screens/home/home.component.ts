import { Component, OnInit } from '@angular/core';
import {BaseComponentComponent} from '../../shared/base-component/base-component.component';
import { apiClient } from 'src/app/service/apiClient';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponentComponent implements OnInit {
  AI_name='Captain Magid';
  my_name='Tamer';
  language='arabic';
  instructions: 'انت خبير في الحساب و الرياضيات ';

  
  messages:string='';
  inputmessage:string='';

  
  
  async send(){
    this.messages=this.messages+'<br/>-----from me--------<br/>' + this.inputmessage;
    let m=await this.chatAI(this.inputmessage);
    
    this.messages=this.messages+'<br/>-----from robot--------<br/>' + m.data;
    this.inputmessage='';
  }

}
