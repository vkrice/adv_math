 function ActivityReport(d) {  
     // This function read /users/emailid/logs & prints the activity in oid
    // d={oid:'ContentMiddle',email:'vkumar@utep.edu'}
    var dtmax=20*60*1e3; //Reset timer for dt>20min aparts
    var dtmin = 60*1e3; //Print every 60*1s
    var iq=0; var s=''; 
   db.collection('/users/'+d.email+'/logs').get().then((qS) => { 
     qS.forEach((doc) => {  var dt=0, dtL=0, t1=null, t2=null, tTotal=0, t;
      var ss = '<tr><td>Total(min)</td><td>dt(min)</td><td>UTC</td><td>Action</td><td>Local time</td></tr>';
      for(var k in doc.data()) { 
        var  t=parseInt(k); 
        var time = new Date(t), timeL = new Date(t).toLocaleTimeString();
        if(t2==null) { t1=t; t2=t;  
          ss += '<tr><td>%s</td><td>%s</td><td>%s:%s </td><td> %s</td><td>%s</td></tr>'
          .format(Math.round(tTotal/60e3), 0,time.getUTCHours(), time.getUTCMinutes(),doc.data()[k], timeL );
        } else {
          dt=t-t1; dtL=0; t1=t; 
          if(t-t2>dtmin ) {dtL=t-t2; t2=t;}
          if(dtL>dtmax) { dt=0; dtL=0; t1=null; t2=null;}
          tTotal += dtL; 
        } 
        if(dtL>dtmin) ss += '<tr><td>%s</td><td>%s</td><td>%s:%s </td><td> %s</td><td>%s</td></tr>'
         .format(Math.round(tTotal/60e3), parseFloat(dtL/60e3).toFixed(2),time.getUTCHours(), time.getUTCMinutes(),doc.data()[k], timeL );
      }
      var tHours = parseFloat(tTotal/3600e3).toFixed(2);
      s += "<div clicked=0 onclick=\"toggleVK('."+doc.id+"',$(this));\"><b>"+doc.id+'</b> ('+tHours+' hours)</div>';
      s += '<table border=1 class='+doc.id+' style="display:none;">'+ss+'</table>';
    })
    $('#'+d.oid).html(s);
   })
  }