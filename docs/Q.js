function EditQ(id){ var col = 'Q/'+id;
  if( $('#CollectionID').length ) col = $('#CollectionID').val() + '/' + id;
  if($('#Hindi').prop('checked')) col = col + '/Langs/Hindi';
  LogUserInfo('EditQ: %s '.format(col));
  db.doc(col).get().then(function(doc) { 
    if(!doc.exists) { $('#ContentMiddle').html("'"+col +"' doesn't exists!"); return }
    var s = '<span id=QID qid='+id+'><u>'+col+'</u></span>', sc='', k, d=doc.data(); 
     if(!d['Desc']) d['Desc']='Description';
     if(!d['Soln']) d['Soln']='Solution';
     if(!d['Choices']) d['Choices']=[{v:1},{v:2}];
     if(!d['a']) d['a']={group:"default",groups:["default"]};

     qdata=d;
     k='group'; s += '<br/>Group:<input id=a-'+k+' class=BoxBorderGreen size=3 color="green" value='+d['a'][k]+' /> | Groups:[incomplete]<hr/>';
     k='Desc'; s += '<div id='+k+' class=QEdit>'+d[k]+'</div>';
     k='Choices';
     for(var kk of Object.keys(d[k])) { if(!d[k][kk].a) d[k][kk].a=0; 
        var chkd = (d[k][kk].a==1)?'checked':'';
        sc += '<tr><td width=1%><input type=checkbox id=a'+kk+' '+chkd+'></input></td>'; 
        sc += '<td><div id='+k+'-'+kk+' class=QEdit kk='+kk+' type=Choices>'+d[k][kk].v+'</div></td></tr>';
        nchoice=kk;
     }

     s += '<table id=myTable width=100% border=1>'+sc+'</table>';
     k='Soln'; s += '<div id='+k+' class=QEdit>'+d[k]+'</div>';
     s += '<button class=Edit onclick="OpenEditors(); $(\'.Save\').show(); $(this).hide(); ">Edit</button>'; 
     s += '<button id=SaveB class=Save style="display:none;" onclick="SaveQ();">Save</button>';
     s += '<button class=Save style="display:none;" onclick="InsertRow(); ">Add-Choice</button>'; 
     s += '<span class=Save style="display:none;"><input id=FixTimestamp  type=checkbox>Fix timestamp</input></span>';
     s += '<div class=SaveMsg></div>';

     $('#ContentMiddle').html(s);
   });
}

function SaveQ(){ var qid=$('#QID').attr('qid'); var kk=0, col='Q/'+qid;
  LogUserInfo('SaveQ: %s '.format(col));
  $(".QEdit").each(function() {var id=$(this).attr('id');
        if(editors[id]) { 
          if($(this).attr('type')=='Choices') { 
            qdata['Choices'][kk].a=($('#a'+kk).prop('checked'))?1:0;
            qdata['Choices'][kk].v=editors['Choices-'+kk].getData(); kk += 1;
          } else { qdata[id]=editors[id].getData();        }
        }
        
  });
  qdata['a']['group']= $('#a-group').val();
    if( $('#CollectionID').length ) col = $('#CollectionID').val() + '/' + qid;
    if($('#Hindi').prop('checked')) col = col + '/Langs/Hindi';
    qdata['modifiedBy']=firebase.auth().currentUser.email;
    qdata['modifiedAt']=firebase.firestore.Timestamp.now().toMillis();
    if(!qdata['createdBy']) qdata['createdBy']=firebase.auth().currentUser.email;
    if(!qdata['createdAt']) qdata['createdAt']=firebase.firestore.Timestamp.now().toMillis();
    if($('#FixTimestamp').prop('checked')) qdata['createdAt']=firebase.firestore.Timestamp.now().toMillis();
  //db.collection(col).doc(qid).set(qdata);
  db.doc(col).set(qdata);
  $('.SaveMsg').html(new Date(qdata['modifiedAt']).toLocaleString()); 
  $('.SaveMsg').fadeOut(3000, function(){ $('.SaveMsg').show().empty(); }); 
}

function InsertRow() {var k='Choices'; nchoice = parseInt(nchoice) + 1; var kk=nchoice;
  var table = document.getElementById("myTable");
  var row = table.insertRow(nchoice);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  qdata[k][kk]={};
  cell1.innerHTML = '<input type=checkbox id=a'+kk+' ></input>'+kk;
  cell2.innerHTML = '<div id='+k+'-'+kk+' class=QEdit kk='+kk+' type=Choices>Enter Value</div>';
}
 
class ListQ {
  constructor(O) { 
    for(var k of Object.keys(O)) {this[k] = O[k];} 
    if(!O.hasOwnProperty('col')) this['col'] = 'Q'; 
    if(!O.hasOwnProperty('id')) this['id'] = 'test1'; 
    if( $('#CollectionID').length ) this['col'] = $('#CollectionID').val();
  }; 
  ListWhereQ(g){ 
   db.collection(this.col).where('a.group','==',g).get().then((qS) => { var s = '', iq=0; 
          qS.forEach((doc) => {  iq++; 
            var b='<button class=QButtons onclick="\
             EditQ('+"'"+doc.id+"'"+'); \
             $(\'.QButtons\').css(\'font-weight\',\'normal\'); \
             $(this).css(\'font-weight\',\'bold\'); \
             ">Q '+iq+'</button>';
            s += '<br/>'+b; 
          });
          $('#ContentRight').html(s);
   });
  }
  ListWhereQ2(key,cond,value){ 
   LogUserInfo('ListWhereQ: %s %s %s %s'.format(this.col, key, cond, value));
   db.collection(this.col).where(key,cond,value).get().then((qS) => { var s = '', iq=0; 
          qS.forEach((doc) => {  iq++; 
            var b='<button class=QButtons onclick=" EditQ('+"'"+doc.id+"'"+'); toggleBold(\'.QButton\',$(this) );">'+iq+'</button>';
            s += '<br/>'+b; 
          });
          $('#ContentRight').html(s);
   });
  }

  ListAllQ(O){ 
   LogUserInfo('ListQ: ListAllQ ' + this.col);
   var OBy = (O.hasOwnProperty('orderBy'))? O['orderBy']:firebase.firestore.FieldPath.documentId();
   db.collection(this.col).orderBy(OBy).get().then((qS) => { 
     var s = '', iq=0; 
          s += 'Created [<button clicked=0 onclick=" toggleVK(\'.createdAt\', this); ">At</button>'; 
          s += '<button onclick=" toggleVK(\'.createdBy\', this); ">By</button>]<br/>'; 
          s += 'Modified [<button onclick=" toggleVK(\'.modifiedAt\', this); ">At</button>'; 
          s += '<button onclick=" toggleVK(\'.modifiedBy\', this); ">By</button>]<br/>'; 

          qS.forEach((doc) => {  iq++; 
            var cAt = (doc.data().createdAt)? new Date(doc.data().createdAt).toLocaleString():'';
            var mAt = (doc.data().modifiedAt)? new Date(doc.data().modifiedAt).toLocaleString():'';
            var cBy = (doc.data().createdBy)? doc.data().createdBy:'', mBy = (doc.data().modifiedBy)? doc.data().modifiedBy:''; 
            var createdAt = '<span class=createdAt style="display:none;">'+cAt+'<br/></span>';
            var createdBy = '<span class=createdBy style="display:none;">'+cBy+'<br/></span>';
            var modifiedBy = '<span class=modifiedBy style="display:none;">'+mBy+'<br/></span>';
            var modifiedAt = '<span class=modifiedAt style="display:none;">'+mAt+'<br/></span>';

            var b='<button class=QButtons onclick="\
             EditQ('+"'"+doc.id+"'"+'); \
             $(\'.QButtons\').css(\'font-weight\',\'normal\'); \
             $(this).css(\'font-weight\',\'bold\'); \
             ">'+iq+'</button>' + createdAt + createdBy + modifiedBy + modifiedAt;
            s += b; 
          });
          $('#ContentRight').html(s);
   });
  }
  
 ListOneQ(id){ 
  LogUserInfo('ListQ: ListOneQ ' + this.col + '/' + id);
  db.collection(this.col).doc(id).get().then((doc) => {  
     var s='<button onclick="EditQ('+"'"+doc.id+"'"+');">'+doc.id+'</button>';
     $('#ContentRight').html(s);
  })
 }
 NewQ(){ 
   LogUserInfo('NewQ: ' + this.col);
   var qid='%s%s'.format(firebase.firestore.Timestamp.now().toMillis(),getRandomNumber(100000,999999));
   db.collection(this.col).doc(qid).set(
     {
       'Desc':'Desc',
       'Choices':[{}], 
       'createdAt':firebase.firestore.Timestamp.now().toMillis(),
       'createdBy':firebase.auth().currentUser.email
      }
     ); 
  }
}


var etb= {
					items: [
						'heading', '|','undo','redo','bold','italic',	'link',	'bulletedList',	'numberedList',	'|',
						'outdent','indent','|','insertTable','fontBackgroundColor',	'fontColor','fontSize',
						'fontFamily',	'removeFormat',	'highlight',	'MathType',	'ChemType',	'specialCharacters',
						'strikethrough','subscript',	'superscript',	'restrictedEditingException',	'pageBreak',
						'htmlEmbed',	'horizontalLine',		'code',		'codeBlock',	'blockQuote',	'imageUpload',	'imageInsert'
					]
				};

var imgtb= {toolbar: [			'imageTextAlternative',	'imageStyle:full',	'imageStyle:side'		]	};
var tbtb= {contentToolbar: ['tableColumn',	'tableRow',	'mergeTableCells',	'tableCellProperties','tableProperties'			]				};

function OpenEditors(){$(".QEdit").each(function() {var id=$(this).attr('id'); OpenEditor(id);}) }
function OpenEditor(id){  
  InlineEditor
    .create(document.querySelector('#'+id), {toolbar:etb, language:'en', image:imgtb, table:tbtb, licenseKey: '',})
    .then( editor => { editors[id] = editor; } )
    .catch( error => {console.error( error ); } );  
}

function toggleBold(id,e) {$(id).css('font-weight','normal'); e.css('font-weight','bold');}
function getUrlVars() { 
  var vars = {}; 
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { vars[key] = value; });
  return vars;
}

function toggleVK(tid, e) { // Toggle tid, attr 'click=0'
 $(tid).toggle(); if($(tid).css('display') == 'none') $(e).attr('clicked',0); else $(e).attr('clicked',1);
}