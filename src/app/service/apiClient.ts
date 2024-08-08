import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';
declare const moment:any;
@Injectable({
  providedIn: 'root'
})

export class apiClient {

  constructor(private httpService: HttpService) { }
  static mutex_busy: number = 0;
  ngOnInit(): void { }
  async asyncSleep(msecs: number) {
    await new Promise(resolve => setTimeout(resolve, msecs));
  }
  async awaitmutex() {
    while (apiClient.mutex_busy) {
      let t = await this.asyncSleep(10);
    }
    apiClient.mutex_busy = 1;
  }
  releasemutex = function () {
    apiClient.mutex_busy = 0;
  }
  async callAPIMethod(methodName: string, args: any) {
    let r;
    await this.awaitmutex();
    try {
      r = await this.httpService.get(environment.apiServiceUrl + methodName + '?' + args) as any;
    }
    catch (e) {
      console.log(e);
      r = null;
    }
    this.releasemutex();
    return r;
  }
  async callAPIMethodPOST(methodName: string, args: any, data: any) {
    let r;
    await this.awaitmutex();
    try {
      r = await this.httpService.post(environment.apiServiceUrl + methodName + '?' + args, data) as any;
    }
    catch (e) {
      console.log(e);
      r = null;
    }
    this.releasemutex();
    return r;
  }
  async callWSMethod(methodName: string, args: any,timeout:number=30) {
    try {
      //console.log(' starting callWSMethod');
      let ar = methodName.split('.');
      let apiClass = ar[0];
      let functionName = ar[1];
      let wsh = new WSHandler();
      let ws = await wsh.createWS(apiClass);
      if (!ws) {
        //console.log('callWSMethod ws is null');
        return null;
      }
      //console.log('callWSMethod ws present');
      args.method = functionName;
      let r:any = await wsh.sendAndWaitForReply(args,timeout);
      //console.log('callWSMethod sendAndWaitForReply is done');
      return r;
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
  isObject(item: any) {
    return (item && typeof item === 'object');
  }

  mergeDeep(target: any, source: any, removeNomatchMembersFromTarget: boolean = false) {
    let changes = 0;
    if (this.isObject(target) && this.isObject(source)) {
      let srckeys = '';
      for (const key in source) {
        srckeys += `|${key}|`;
        if (Array.isArray(source[key])) {
          if (!target[key]) { changes++; target[key] = [] };
          let i;
          for (i = 0; i < source[key].length; i++) {
            if (i >= target[key].length) { changes++; target[key].push(source[key][i]); }
            else {
              if (this.isObject(source[key][i])) {
                let ct = this.mergeDeep(target[key][i], source[key][i], removeNomatchMembersFromTarget);
                changes += ct.changes;
              }
              else {
                if (target[key][i] != source[key][i]) {
                  target[key][i] = source[key][i];
                  changes++;
                }
              }
            }
          }
          if (i < source[key].length) {
            source[key] = source[key].slice(0, i);
            changes++;
          }
        }
        else
          if (this.isObject(source[key])) {
            if (!target[key]) { changes++; Object.assign(target, { [key]: {} }); }

            let ct = this.mergeDeep(target[key], source[key], removeNomatchMembersFromTarget);
            changes += ct.changes;
          }
          else // scalar
          {
            if (target[key] != source[key]) {
              target[key] = source[key];
              changes++;
            }
            //Object.assign(target, { [key]: source[key] });
          }
      }
      if (removeNomatchMembersFromTarget) {
        for (let key in target) {
          if (srckeys.indexOf(`|${key}|`) < 0 && this.isObject(target[key]))
            delete target[key];
        }
      }
    }
    return { target, changes };
  }
}

class WSHandler{
  static websockets:any={};
  ws:any;
  async createWS(apiClass:string){
      return new Promise(async (resolve:any,error)=>{
          try{
              this.ws=WSHandler.websockets[apiClass];
              if(this.ws)
              {
                  let isalive=this.isWSAlive();
                  if(isalive)
                  {
                      resolve(this.ws);
                      return;
                  }
              }
              let url=environment.apiServiceUrl.replace('https://','wss://').replace('http://','ws://').replace('/api/','/api-ws/')+apiClass+'.ws';
              this.ws = new WebSocket(url);
              this.ws._apiClass=apiClass;
              this.ws._listeners={};
              WSHandler.websockets[apiClass]=this.ws;
              this.ws.addEventListener('error',(event:any)=>{
                  let ws2=WSHandler.websockets[this.ws._apiClass];
                  if(ws2)
                      delete WSHandler.websockets[this.ws._apiClass];
                  resolve && resolve(null);
                  resolve=null;
                  this.ws.close();
              });
              this.ws.addEventListener('close',(event:any)=>{
                  let ws2=WSHandler.websockets[this.ws._apiClass];
                  if(ws2)
                      delete WSHandler.websockets[this.ws._apiClass];
                  resolve && resolve(null);
                  resolve=null;
              });
              this.ws.addEventListener('open',(event:any)=>{
                  resolve && resolve(this.ws);
                  resolve =null;
                  resolve=null;
              });
              this.ws.addEventListener('message',(event:any)=>{
                  let msgstr:string=event.data;
                  let msg=JSON.parse(msgstr);
                  let refid=msg.refid;
                  if(this.ws._listeners[refid])
                  {
                      this.ws._listeners[refid](msg);
                      delete this.ws._listeners[refid];
                  }
              });
          }
          catch(e)
          {
              resolve && resolve(null);
              resolve =null;
          }
      });
  }
  isWSAlive(){
      if(!this.ws || this.ws.readyState==WebSocket.CLOSED || this.ws.readyState ==WebSocket.CLOSING)
          return false;
      return true;
      // let r:any=await this.sendAndWaitForReply({method:'ping'},3);
      // if(r?.result!='ok')
      //     return false;
      // return true;
  }
  async sendAndWaitForReply(msg:any,timeout:number=0){
      if(!timeout)
          timeout=30;
      return new Promise((resolve:any,error:any)=>{
          try{
              let refid=`${this.ws._apiClass}.${msg.method}-${moment().format('')}${Math.random()*1000}`;
              this.ws._listeners[refid]=(msg:any)=>{
                  resolve && resolve(msg);
                  resolve=null;
              };
              msg.refid=refid;
              this.ws.send(JSON.stringify(msg));
              if(timeout)
                  setTimeout(()=>{
                      resolve && resolve(null);
                      resolve=null;
              },timeout*1000);
          }
          catch(e)
          {
              resolve && resolve(null);
              resolve=null;
          }
      });
  }
}


