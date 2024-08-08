import { Injectable } from '@angular/core';
declare const $:any;
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  runGroupDiv()
  {
	setTimeout(()=>{
		let collapse='<iconify-icon icon="material-symbols:keyboard-arrow-down"></iconify-icon>';
		let expand=`<iconify-icon icon="material-symbols:keyboard-arrow-up"></iconify-icon>`;
		$('.collapsebutton').each((i:any,el:any)=>{
			let grp=$(el).parent()[0];
			if(grp.groupdivApplied)
				return;
			grp.groupdivApplied=1;
			let collapseheight='20px';
			if($(grp).attr('collapseheight'))
				collapseheight=$(el).attr('collapseheight');
			if($(el).attr('default')=='collapse')
			{
				
				$(el).html(collapse);
				$(grp).css('height',collapseheight);
				$(grp).find('>:not(h1):not(.collapsebutton):not(.outside)').hide();
				grp.expanded=0;
			}
			else
			{
				$(el).html(expand);
				grp.expanded=1;
				$(grp).css('height','');
				$(grp).find('>:not(h1):not(.collapsebutton):not(.outside)').show();
			}
			$(el).on('click',(ev:any)=>{
				let e=ev.target;
				if(e.className!='collapsebutton')
					e=ev.target.parentElement;
				let grp=$(e).parent()[0];
				if(grp.expanded)
				{
					$(e).html(collapse);
					grp.expanded=0;
					$(grp).css('height',collapseheight);
					$(grp).find('>:not(h1):not(.collapsebutton):not(.outside)').hide();
				}
				else
				{
					$(e).html(expand);
					grp.expanded=1;
					$(grp).css('height','');
					$(grp).find('>:not(h1):not(.collapsebutton):not(.outside)').show();
				}
			});
		});
	},2000);
	
  }
}
