// Initialize your app
//var myApp = new Framework7({template7Pages: true, popupCloseByOutside:false, pushState: true,
//                autoLayout: true});

var myApp = new Framework7({template7Pages: true, popupCloseByOutside:false, pushState: true,
                swipeBackPage: false,  autoLayout: true, animatePages:false});

//pushState: false for disbling back button //swipePanel: "left",

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var hostname = location.hostname;
//alert(hostname);

//var srvURL = "http://www.bluapps.in/test/vaccifireapp.php";
var srvURL = "http://www.vaccifire.com/api/vaccifireapp.php";
if(hostname == 'localhost')
{
    var srvURL = "http://localhost/test/vaccifireapp.php";
}
var version = "100";
var app_name ="Vaccifire";
var appname = "Vaccifire";

$$(document).on('ajaxStart', function (e) { myApp.showIndicator(); }); 
$$(document).on('ajaxComplete', function () { myApp.hideIndicator(); });

//alert('hello 1');

//myApp.alert('Hello 2', '');

myApp.onPageInit('main', function (page) {

    a_vendor_name = localStorage.getItem("a_vendor_name");
    //alert(a_vendor_name);
    if(a_vendor_name === null || a_vendor_name == undefined)
    {
        myApp.alert('Please Login','')
    }else{

        a_client_id = localStorage.getItem("a_client_id");
        client_name = localStorage.getItem("a_client_name");
        $$("#propinfo").html('<font size="20">' + client_name + '</font>');
        //myApp.alert(a_client_id)

        if(a_client_id == null || a_client_id == undefined || a_client_id == 'undefined' || a_client_id == '')
        {
            $$("#pause").hide();
            $$("#resume").hide();
            $$("#complete").hide();
        }else
        {
            a_pause = localStorage.getItem("a_pause");
            if(a_pause == null || a_pause == undefined || a_pause == 'undefined' || a_pause == '0')
            {
                 $$("#pause").show();
                 $$("#resume").hide();
            }else if(a_pause == '1')
            {
                 $$("#pause").hide();
                 $$("#resume").show();
            }
            
        }

        //alert(a_vendor_name);
        $$("#userfullname").html('&nbsp;' + a_vendor_name);
    }


});


function startscan()
{
    device_id= localStorage.getItem("device_uuid");
    device_platform= localStorage.getItem("device_platform");
    device_browser= localStorage.getItem("device_browser");
    session_version= localStorage.getItem("session_version");
    session = localStorage.getItem("session_id_local");

    barcode = '';
    
    cordova.plugins.barcodeScanner.scan(
    function (result) 
    {
          //myApp.alert("We got a barcode\n" +"Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled, '');

            barcode = result.text;

            //myApp.alert('barcode '+barcode,'');
            if(barcode.length ==0)
            {
                myApp.alert('Please scan again', '');
                return false;
            }

            if(barcode) 
                {
                    try {
                        test = JSON.parse(barcode);

                        
                         //myApp.alert('This QR Code is not for the Main Gate','')

                            //myApp.alert('product_id: ' + test.product_id, '');
                            //myApp.alert('catid: ' + test.catid, '');
                            //myApp.alert('product_srno: ' + test.product_srno, '');
                            //myApp.alert('client_id: ' + test.client_id, '');
                            //test.pname
                            //test.id

                            id = test.id;
                            p = test.p;
                            //myApp.alert('barcode '+barcode,'');
                            //myApp.alert('id '+id,'');
                            //myApp.alert('product id p '+p,'');
                            if(id == undefined || id == 'undefined')
                            {

                                if(test.p == undefined || test.p == 'undefined')
                                {
                                    myApp.alert('Error, not a valid QR Code, Please scan again','');
                                    return false;
                                }else
                                {
                                    a_client_id = localStorage.getItem("a_client_id");
                                    //myApp.alert('a_client_id '+a_client_id, '')
                                    if(a_client_id == null || a_client_id == undefined || a_client_id == 'undefined')
                                    {
                                        myApp.alert('Error, Please scan Client QR code and start scanning product QR Code','');
                                        return false;
                                    }

                                    var url = srvURL + "/productdetails";//?mobile=9702502361&pass=9702502361
                                    
                                    $$.ajax({
                                        url: url,
                                        method: "POST",
                                        data: {id: test.p, device_id:device_id, device_platform: device_platform, ver: version, mysess: localStorage.getItem("a_mysess"), clientid: a_client_id},
                                        processData: true,
                                        dataType: 'json',
                                        timeout : 50000,

                                        success: function (e, status, xhr)
                                        { 
                                            if(e.status == 'success')
                                            {
                                                client_id = e.client_id;
                                                catid = e.cat_id;
                                                subcat_id = e.subcat_id;
                                                scanned = e.scanned;
                                                alreadyscanned = e.alreadyscanned;
                                                product_srno = urldecode(e.product_srno);
                                                product_name = urldecode(e.product_name);
                                                product_location = urldecode(e.product_location);
                                                //myApp.alert('client_id '+ client_id,'')
                                                //myApp.alert('catid '+ catid,'')
                                                //myApp.alert('scanned '+ scanned,'')

                                                if(alreadyscanned == '1')
                                                {
                                                    myApp.alert('This QR code is already scanned','');
                                                    return false;
                                                }
                                                 
                                                client_id3=  localStorage.getItem("a_client_id");
                                                client_name3=  localStorage.getItem("a_client_name");
                                                total3=  localStorage.getItem("a_client_total");
                                                visit=  localStorage.getItem("a_visit_type");
                                                
                                                if(client_id3 == null || client_id3 == undefined || client_id3 == 'undefined' || client_id3 == '')
                                                {
                                                    myApp.alert('Please scan Client QR first and than start scanning Product QR code','');
                                                    return false;
                                                }    

                                                if(client_id3 != client_id)
                                                {
                                                    myApp.alert('Client ID & QR code is not matching','');
                                                    return false;
                                                }  

                                                if(catid == '2')// || test.product_id == '22' - mistake
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'reelhydrant.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }
                                                if(catid == '3')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'extinguisher.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }
                                                if(catid == '4' )//|| test.product_id == '21'
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'hydrantvalve.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }

                                                if(catid == '5')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'hooter.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }                           
                                                if(catid == '6')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'mainpanel.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }
                                                if(catid == '7')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'repeaterpanel.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }

                                                if(catid == '10')// || test.product_id == '23'
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'dieselpump.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }
                                                if(catid == '11')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'boosterpump.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }   

                                                if(catid == '14')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'alarmvalve.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }

                                                if(catid == '15')
                                                {
                                                    //myApp.alert('open form gas','')
                                                    mainView.router.load({
                                                        url: 'hydranthosebox.html',
                                                        context: {
                                                           product_id: test.p, product_srno: product_srno, client_id: client_id, catid:catid, product_name: product_name, scanned: scanned, product_location: product_location
                                                        }
                                                    });
                                                }


                                            }else
                                            {
                                                //myApp.alert('error: ' + e.status,  '');
                                                myApp.alert(e.message,  ''); 
                                            }
                                        },
                                        error: function (xhr, status)
                                        {
                                            myApp.hideIndicator();

                                            if(status == 0)
                                            {
                                                myApp.alert('Please Check Internet',  ''); 
                                            }else
                                            {
                                                myApp.alert('failure * ' +  status,  '');  
                                            }; 

                                        }
                                    });
                                    

                                }
                                /*
                                if(test.catid == undefined)
                                {
                                    myApp.alert('Error, Category not found','');
                                    return false;
                                }else
                                {
                                    a_client_id = localStorage.getItem("a_client_id");
                                    if(a_client_id != null || a_client_id != undefined || a_client_id != 'undefined')
                                    {
                                        myApp.alert('Error, Please scan Client QR and start scanning product QR Code','');
                                        return false;
                                    }

                                    if(test.catid == '1')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'boosterpump.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }
                                    if(test.catid == '2')// || test.product_id == '22'
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'reelhydrant.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }
                                    if(test.catid == '3')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'extinguisher.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }
                                    if(test.catid == '4')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'hydranthosebox.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }

                                    if(test.catid == '5')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'hooter.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }                           
                                    if(test.catid == '6')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'mainpanel.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }
                                    if(test.catid == '7')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'repeaterpanel.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }

                                    if(test.catid == '10')// || test.product_id == '23'
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'dieselpump.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }

                                    if( test.catid == '13')
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'alarmvalve.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }

                                    if(test.catid == '14' )//|| test.product_id == '21'
                                    {
                                        //myApp.alert('open form gas','')
                                        mainView.router.load({
                                            url: 'hydrantvalve.html',
                                            context: {
                                               product_id: test.p_id, product_srno: test.psrno, client_id: test.cid
                                            }
                                        });
                                    }
                                }
                                */
                            }else
                            {
                                myApp.alert('Client: ' + test.name + ' * ID: ' + test.id,'');
                                //localStorage.setItem("a_client_id", test.id);
                                //localStorage.setItem("a_client_name", test.name);
                                
                                var url = srvURL + "/clientdetails";//?mobile=9702502361&pass=9702502361
                                
                                $$.ajax({
                                    url: url,
                                    method: "POST",
                                    data: {id: test.id, device_id:device_id, device_platform: device_platform, ver: version},
                                    processData: true,
                                    dataType: 'json',
                                    timeout : 50000,

                                    success: function (e, status, xhr)
                                    { 
                                        if(e.status == 'success')
                                        {
                                            total = e.counter;
                                            mainView.router.load({
                                                    url: 'landing.html',
                                                    context: {
                                                       client_id : test.id, client_name: test.name, total: total, mysess: e.mysess
                                                    }
                                              });                
                                        }else
                                        {
                                            //myApp.alert('error: ' + e.status,  '');
                                            myApp.alert(e.message,  ''); 
                                        }
                                    },
                                    error: function (xhr, status)
                                    {
                                        myApp.hideIndicator();

                                        if(status == 0)
                                        {
                                            myApp.alert('Please Check Internet',  ''); 
                                        }else
                                        {
                                            myApp.alert('failure * ' +  status,  '');  
                                        }; 

                                    }
                                });
                                
                                //return false;
                            }   



                    } catch(e) 
                    {
                        /*
                        //myApp.alert(e,''); // error in the above string (in this case, yes)!
                        var res = barcode.split(":"); 
                        //myApp.alert('field 1: ' + res[0],'')
                        //myApp.alert('field 2: ' + res[1],'')
                        //myApp.alert('field 3: ' + res[2],'')
                        myApp.alert('Total QR code need to be scanned : ' + res[2],'')

                        //landing
                        mainView.router.load({
                                url: 'landing.html',
                                context: {
                                   
                                }
                            });
                        */
                    }
                }

            //test = JSON.parse(barcode);


            /*mainView.router.load({
                    url: 'boosterpump.html',
                    context: {
                       product_id: test.product_id, product_srno: test.product_srno, client_id: test.client_id
                    }
                });
            */

            //$$('#acid').text('');
            /*
            //alert(serviceURL);
            //url = serviceURL + 'changepass/' + ourclub_id;
            url = srvURL + 'opengate/' + localStorage.getItem("session_id_club_id");
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            
            $$.ajax({
                url: url,
                method: "POST",
                data: {barcode: barcode, id: id, device_id: device_id, device_platform: device_platform, device_browser: device_browser, ver: session_version, session: session},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status == 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert(e.message,  '');                         
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });
            */
      }, 
      function (error) {
          myApp.alert("Scanning failed: " + error, '');
          barcode = '';
          return false;
      }
   );
}

function startscan2()
{
    device_id= localStorage.getItem("device_uuid");
    device_platform= localStorage.getItem("device_platform");
    device_browser= localStorage.getItem("device_browser");
    session_version= localStorage.getItem("session_version");
    session = localStorage.getItem("session_id_local");

    barcode = '';
    
    cordova.plugins.barcodeScanner.scan(
    function (result) 
    {
          //myApp.alert("We got a barcode\n" +"Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled, '');

            txt = result.text;

            if(txt.length ==0)
            {
                myApp.alert('Please scan again', '');
                return false;
            }

            //test = JSON.parse(barcode);

            //myApp.alert('product_id: ' + test.product_id, '');
            //myApp.alert('product_srno: ' + test.product_srno, '');
            //myApp.alert('client_id: ' + test.client_id, '');

            //var txt = '12:A123456:2';
            if(txt) 
                {
                    try {
                        test = JSON.parse(txt);

                        
                         myApp.alert('This QR Code is not for the Main Gate','')
                        

                    } catch(e) 
                    {
                        //myApp.alert(e,''); // error in the above string (in this case, yes)!
                        var res = txt.split(":"); 
                        //myApp.alert('field 1: ' + res[0],'')
                        //myApp.alert('field 2: ' + res[1],'')
                        //myApp.alert('field 3: ' + res[2],'')
                        myApp.alert('Total QR code need to be scanned : ' + res[2],'')

                        //landing
                        mainView.router.load({
                                url: 'landing.html',
                                context: {
                                   
                                }
                            });
                    }
                }

      }, 
      function (error) {
          myApp.alert("Scanning failed: " + error, '');
          barcode = '';
          return false;
      }
   );
}

function test1()
{
    device_id= localStorage.getItem("device_uuid");
    device_platform= localStorage.getItem("device_platform");
    device_browser= localStorage.getItem("device_browser");
    session_version= localStorage.getItem("session_version");
    user_id = localStorage.getItem("session_id_username");

     txt = '{"id":1,"name":"Valencia"}';
    //var txt = '12:A123456:2';

            test = JSON.parse(txt);

            id = test.id;
            //myApp.alert('id '+id,'');
            if(id == undefined)
            {
                if(test.catid == undefined)
                {
                    myApp.alert('Error, code not found','');
                    return false;
                }
            }else
            {
                myApp.alert('Client: ' + test.name,'');
                //localStorage.setItem("a_client_id", test.id);
                //localStorage.setItem("a_client_name", test.name);
                
                var url = srvURL + "/clientdetails";//?mobile=9702502361&pass=9702502361
                
                $$.ajax({
                    url: url,
                    method: "POST",
                    data: {id: test.id, device_id:device_id, device_platform: device_platform, ver: version},
                    processData: true,
                    dataType: 'json',
                    timeout : 50000,

                    success: function (e, status, xhr)
                    { 
                        if(e.status == 'success')
                        {
                            total = e.counter;
                            mainView.router.load({
                                    url: 'landing.html',
                                    context: {
                                       client_id : test.id, client_name: test.name, total: total
                                    }
                              });                
                        }else
                        {
                            //myApp.alert('error: ' + e.status,  '');
                            myApp.alert(e.message,  ''); 
                        }
                    },
                    error: function (xhr, status)
                    {
                        myApp.hideIndicator();

                        if(status == 0)
                        {
                            myApp.alert('Please Check Internet',  ''); 
                        }else
                        {
                            myApp.alert('failure * ' +  status,  '');  
                        }; 

                    }
                });
                
                //return false;
            }   




}


function t2()
{

    myApp.modal({
                title:  '',
                text: 'Do you wish to Close Form?',
                buttons: [
                  {
                    text: 'Yes',
                    onClick: function() {
                      //myApp.alert('You clicked Yes button!')
                      myApp.hideIndicator();
                      mainView.router.back();
                    }
                  },
                  {
                    text: 'No',
                    onClick: function() {
                      //myApp.alert('You clicked No button!')
                    }
                  },
                ]
              })
}

function cam()
{
    myApp.alert('checking camera','');
    navigator.camera.getPicture(onSuccessCam, onFailCam, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI });

}


function onSuccessCam(imageURI) {
     myApp.alert("Camera success .",'')

    var image = document.getElementById('myImage');
    image.src = imageURI;
}

function onFailCam(message) {
    myApp.alert('Failed because: ' + message,'');
}

function loc()
{
    myApp.alert('checking location','')

    cordova.plugins.diagnostic.isLocationAvailable(function(available)
            {
                console.log("Location Service " + (available ? "available" : "not Enabled"));
                myApp.alert("Location Service " + (available ? "available" : "not Enabled"), '');
                //myApp.alert('available ' + available,'')
                if(available)
                {
                    myApp.alert('enabled','');
                    navigator.geolocation.getCurrentPosition(onSuccessLoc2, onErrorLoc2, {maximumAge: 3000, timeout: 20000, enableHighAccuracy: false});

                }else
                {
                     myApp.alert('not working','');
                }
            });


}


    function onErrorLoc2(error) 
    {
        myApp.alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n','');
        myApp.alert('Please Enable Location Service', '')
        //$$("#locmsg2").html('<b>Timeout Occured in getting GPS Service</b>');
    }

   var onSuccessLoc2 = function(position) 
    {
        myApp.alert('Latitude: '    + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Accuracy: '          + position.coords.accuracy ,''          );
            $$('#txtlattitude').val(position.coords.latitude);
            $$('#txtlongitude').val(position.coords.longitude);
            initMap();

    };
    
    function initMap() {
      var lattitude = $$('#txtlattitude').val();
      var longitude = $$('#txtlongitude').val();
      var zoom = 15;
      var beachMarker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
          });
      if(lattitude=='' || isNaN(lattitude)){
          lattitude = 20.0093663;
          longitude = 75.7585553;
          zoom = 4;
          beachMarker = '';
      }
	var map_canvas = document.getElementById('map_canvas');
	var map_options = {
	  center: {lat: lattitude, lng: longitude},
          zoom: zoom,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(map_canvas, map_options)
	var myLatLng = new google.maps.LatLng(lattitude,longitude);
	
	
        
	
  }
    