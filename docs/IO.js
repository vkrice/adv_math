// db----------------
//var db = firebase.firestore();
class Info { 
  constructor(O) { 
    for(var k of Object.keys(O)) {this[k] = O[k];} 
    if(!O.hasOwnProperty('col')) this['col'] = 'public'; 
    if(!O.hasOwnProperty('id')) this['id'] = 'test1'; 
    if(!O.hasOwnProperty('db')) this['db'] = firebase.firestore(); 
  }; 
  put(O) { var col = this.col, id=this.id, db=this.db;
   var d = (O.hasOwnProperty('d')) ? O['d'] : {name: "Los Angeles", state: "CA", country: "USA" };
   //db.collection(col).doc(id).set(d); 
   alert(uinfo.email); 
  }
}


function getAllInputValues(eid) { var d=[]; $(eid).each(function() {d.push($(this).val());}); return d; }
function LoadAllInputValues(eid, d) { var k=0; $(eid).each(function() {$(this).val(d['inputs'][k]);++k;}); }

class IO3 {
  constructor(O) {
    var dflt = {uqid:uniqid(), col:'public', doc:'test1', oid:'middle', db:firebase.firestore(), dtype:'html', tb:'ckbasic'};
    for(var k of Object.keys(dflt)) {this[k] = dflt[k];} 
    for(var k of Object.keys(O)) {this[k] = O[k];}  // Overwrite the defalut values
    this.ignoreKeys=['a','group','groups','key','keys'];
  }
//--------
ListAll(O){ 
   LogUserInfo('IO3: ListAll ' + this.col);
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

            var b='<button class=QButtons data-col='+this.col+ ' data-doc='+doc.id+' onclick="\
            new IO3($(this).data()).Edit(\'ContentMiddle\'); \
             $(\'.QButtons\').css(\'font-weight\',\'normal\'); \
             $(this).css(\'font-weight\',\'bold\'); \
             ">'+iq+'</button>' + createdAt + createdBy + modifiedBy + modifiedAt;
            s += b; 
          });
          $('#ContentRight').html(s);
   });
  }

 fb_put(col,id,d) {
  db.collection(col).doc(id).set(d, {merge: true })
  .then(function(docRef) { console.log("Document written"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_update(col,id,d) {
  db.collection(col).doc(id).update(d)
  .then(function(docRef) { console.log("Document updated"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_get(col,doc) {
    db.collection(col).get().then((querySnapshot) => {
   	 querySnapshot.forEach((doc) => { console.log(`${doc.doc} => ${doc.data()}`); });
    });
 }
Edit(outputid) { this.oid = outputid; self = this;
       db.collection(this.col).doc(this.doc).get().then(function(doc) { 
        if (doc.exists) { $('#'+self.oid).html( self.O2html(doc.data()) );  } 
      });
}
Display(outputid) { var docid=this.col+'/'+this.doc; self=this;
       db.doc(docid).get().then(function(doc) { if (doc.exists) { $('#'+outputid).html(self.JSON2html(doc.data()));  } });
}
getOne(O) { self=this; 
       db.this(this.col+'/'+this.doc).get().then(function(doc) { if (doc.exists) { self.data = doc.data();  } });
       return self.data;
}

JSON2html(d) {  var s='',uqid=this.uqid;
 var a=d.a?d.a:{}; 
 if(d.a.timer) { var dt=d.a.timer;
  var ss = "Elapsed: <span id=elapsedtime></span> (left <span id=timer></span>)";
  var sb = "<button id=startTimer onclick=\"startTimer(%s,'timer'); elapsedTime(%s,'elapsedtime'); $('#ssID').show(); \">Start</button>".format(dt,dt);
  s += "<span style='float:right;'><span id=ssID style='display:none;' > %s</span> %s </span>".format(ss,sb); 
 }
 for(var k in d) { 
   if(this.ignoreKeys.indexOf(k)>-1) continue; 
   if(!(typeof d.k== 'object')) {
     s += '<span id=Display%s data-v=%s>%s</span>'.format(uqid,k,d[k]);
   }
 }
 var eid='#Display'+uqid+ ' :input'; 
 var Idb = '/users/%s/%s/%s'.format('instructor',this.col,this.doc);
 var udb = '/users/%s/%s/%s'.format(uinfo.email,this.col,this.doc);
 //s += '%s %s %s'.format(eid,Idb,udb);
 s += "<button onclick=\"db.doc('%s').set({'inputs':getAllInputValues('%s')});\">Submit</button>".format(udb,eid);
 s += "<button onclick=\"db.doc('%s').set({'inputs':getAllInputValues('%s')});\">Instructor Submit</button>".format(Idb,eid);
 s += "(Ans<button onclick=\"db.doc('%s').get().then(function(doc) {if(doc.exists) LoadAllInputValues('%s',doc.data() ); });\">My</button>".format(udb,eid);
 s += "<button onclick=\"db.doc('%s').get().then(function(doc) {if(doc.exists) LoadAllInputValues('%s',doc.data() ); });\">Instructor</button>)".format(Idb,eid);
 return s;
}

LoadButtons(O) {  var s ='';
  for(var k in O) {
    s = "<button onclick=\"  \
      var d=$('#"+elID+"').data(); d.dtype='html'; var I=new IO3(d); I.Edit('"+oID+"');  \" \
      >Load</button>"; 
  }
}
 Editable(k,v) { 
   return "<span contenteditable=true oninput=\" $('#"+this.uqid+"').attr('"+k+"', $(this).text()); \">"+v+"</span>";
 }
 O2html(O) { var dtype=this.dtype,col=this.col, doc=this.doc, uqid=this.uqid,  oid=this.oid;
    var attr = JSON.stringify(O.a, null,1);
    tb=ifSet(O,'a.tb')? cktb(O.a.tb) : cktb('ck4basic'); 
    var v = O.v, key='v';

    if(dtype=='json') var v = JSON.stringify(O, null,1);
    if(O.a && O.a.PrettyPrint===0) var v = JSON.stringify(O);

    var colhtml = this.Editable('data-col',col), dochtml = this.Editable('data-doc',doc);
    var Raw = "<button onclick=\"var d=$('#"+uqid+"').data(); d.dtype='json'; var I=new IO3(d); I.Edit('"+oid+"');  \">Raw</button>"; 
    var Dis = "<button onclick=\"var d=$('#"+uqid+"').data(); d.dtype='json'; var I=new IO3(d); I.Display('"+oid+"');  \">Dis</button>"; 
    var editor = (dtype=='html')?'ckeditor':'TA';
    if(CKEDITOR.instances[uqid+key]) CKEDITOR.instances[uqid+key].destroy();
    var eid=uqid+key;
    if(dtype=='json') var ss = "<br/><textarea cols=50 rows=10 data-key=" + key + " id="+ uqid+key+ ">"+v+"</textarea><br/> ";
    else var ss = "<div data-key=" + key + " id="+ uqid+key+ " \
      ondblclick=\"  $('#"+uqid+"close').show(); CKEDITOR.replace('"+eid+"',{toolbar:tb}); \" \
      >"+v+"</div>";
    var s = " \
     <span data-col=" + col + " data-doc="+doc+ " data-oid="+this.oid+" data-key="+key+" data-dtype='"+dtype+"' data-uqid="+uqid+" id="+ uqid+ ">\
        /"+colhtml+"/"+dochtml+ LoadButton(uqid,this.oid) + Raw + Dis + ss + " \
     </span> \
       <button class="+uqid+"hide onclick=\" UpdateByID('"+uqid+"'); \">Save</button> \
       <button class=hide id="+uqid+"close onclick=\" $(this).hide(); if(CKEDITOR.instances['"+eid+"']) CKEDITOR.instances['"+eid+"'].destroy(); \">Close</button> \
       <input id="+ uqid +"update type=checkbox checked=true>Update</input> | \
       <input id="+ uqid +"realtime type=checkbox onclick=\" RealtimeByID('"+uqid+"'); \">Realtime</input> \
       <div id="+uqid+"msg>"+uqid+"</div>";
        //if(editor=='ckeditor') s += "<script> CKEDITOR.replace('"+uqid+key+"',{toolbar:tb}); <\/script> ";
    return s;
 }
}

class IO2 {
  constructor(O) {
    for(var k of Object.keys(O)) {this[k] = O[k];} 
    if(!O.hasOwnProperty('col')) this['col'] = 'public'; 
    if(!O.hasOwnProperty('doc')) this['doc'] = 'test1'; 
    if(!O.hasOwnProperty('db')) this['db'] = firebase.firestore(); 
  }

 fb_put(col,id,d) {
  db.collection(col).doc(id).set(d, {merge: true })
  .then(function(docRef) { console.log("Document written"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_update(col,id,d) {
  db.collection(col).doc(id).update(d)
  .then(function(docRef) { console.log("Document updated"); })
  .catch(function(error) { console.error("Error adding document: ", error); });
 }

 fb_get(col,id,d) {
    db.collection(col).get().then((querySnapshot) => {
   	 querySnapshot.forEach((doc) => {
        	console.log(`${doc.id} => ${doc.data()}`);
    	});
    });
 }

 Edit(col, doc, O) {
    var uqid=uniqid();
    var attr = JSON.stringify(O.a, null,1);
    var v = O.v, key='v';
    var colhtml = "<span contenteditable=false>"+col+"</span>";
    var dochtml = "<span contenteditable=true oninput=\" var d=$('#"+uqid+"').data(); d.doc = $(this).text(); \">"+doc+"</span>";

    return s = " \
     <span data-col=" + col + " data-doc="+doc+ " data-key="+key+" data-type=html data-uqid="+uqid+" id="+ uqid+ ">\
        /"+col+"/"+dochtml+ LoadButton(uqid)+" \
       <br/><textarea cols=50 rows=10 data-col=" + col + " id="+ uqid+key+ ">"+v+"</textarea><br/> \
     </span> \
       <button class="+uqid+"hide onclick=\" UpdateByID('"+uqid+"'); \">Save</button> \
       <input id="+ uqid +"update type=checkbox>Update</input> | \
       <input id="+ uqid +"realtime type=checkbox onclick=\" RealtimeByID('"+uqid+"'); \">Realtime</input> \
        <button onclick=\"if(CKEDITOR.instances['"+uqid+key+"']) CKEDITOR.instances['"+uqid+key+"'].destroy();\">TA</button> \
        <button onclick=\"if(!CKEDITOR.instances['"+uqid+key+"']) CKEDITOR.replace('"+uqid+key+"',{toolbar:tb});\">CK</button> \
       <div id="+uqid+"msg>msg</div>";
        //<script> CKEDITOR.replace('"+uqid+"TA'); <\/script> \
 }
}