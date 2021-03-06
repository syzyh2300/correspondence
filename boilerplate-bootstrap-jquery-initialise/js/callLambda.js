// button New correspondence function
$(document).on("click", "#submit_newcoorespondence", function(){


    var statusValue = $("#Status_value option:selected").val();
    var typeValue = $("#type_value input:checked").val();
    var descriptionValue = $("#Description_value").val();
    var dateValue = getinputdate($("#dateinline").datepicker('getDate'));
    var sentFromPerson = $("#sent_From_Person").val();
    var sentFromCompany = $("#sent_From_Company").val();
    var sentToPerson = $("#sent_To_Person").val();
    var sentToCompany = $("#sent_To_Company").val();
    var correspendenceID = $('#submit_newcoorespondence').attr("data-correspendence-id");
    var checkstatus = 1;//for further checking user ID

    //call stored persedure
    var sprocString = "call insert_new_correspondence(" +correspendenceID+ "," +statusValue+ ",'" +typeValue+ "','" +descriptionValue+ "','" +dateValue+ "','" +sentToPerson+ "','" +sentToCompany+ "','" +sentFromPerson+ "','" +sentFromCompany+ "'," +checkstatus+ ");"; 

    var data = { UserPoolId : 'us-west-2_boi1yXUkS',
            ClientId : '28vv7qns6eobvm2rdvqino0dcu'
        };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();// getting the current user from cashe

    //check cognito user
    if (cognitoUser != null) {
        cognitoUser.getSession(function(err, session) {
            if (err) {
                alert(err);
                return;
            }
            console.log('session validity: ' + session.isValid());
            var AWS_Region = "us-west-2";
            var AWS_idToken = session.getIdToken().getJwtToken();
            var AWS_Logins = {'cognito-idp.us-west-2.amazonaws.com/us-west-2_boi1yXUkS' : AWS_idToken}
            var AWS_IdentityPoolId = "us-west-2:df08250b-a24c-4a6c-826c-e3bb2ae75d63";
            var AWS_UserPoolId = "us-west-2_boi1yXUkS";
            AWS.config.region      = AWS_Region;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                    IdentityPoolId : AWS_IdentityPoolId, 
                                            Logins : AWS_Logins
                                    });
            AWS.config.credentials.get(function(){
                insertdata(sprocString,insertfiles);
                
            }); // end credentials.get
        });
    }
    else{
        alert("Please login in");
        window.location.href = 'index.html';
        return;
    }

});

//lambda function invoke
function insertdata(sprocString,callback){

        var tsting = sprocString;
        var AWS_Region = "us-west-2";
        var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 

        var payload_JSON = {"sproc": tsting }; // create JSON object for parameters for invoking Lambda function
        var payload_String = JSON.stringify(payload_JSON)
        var pullParams = { FunctionName : 'test123', Payload : payload_String }; // http://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html ref this for synchronous / asynchronous
        var pullResults; // create variable to hold data returned by the Lambda function

        lambda.invoke(pullParams, function(err,data){
            callback(err,data);
        }); // end lambda.invoke

}

// insert files to database and s3 storage
function insertfiles(err,data){
    if(err){console.log(err)}
    else{
        var inputlength = document.getElementById('input4').files.length;
        if (inputlength != 0 ) {
            
            var artifacts = document.getElementById('input4').files;
            var sprocString;
            var name;
            var GUID;
            var params;
            var GUID_filename = new Array();
            var s3 = new AWS.S3({
                    region: 'ap-southeast-2',
                    apiVersion: '2006-03-01',
                    params: {Bucket: 'correspendence'}
                    });
            
            var pullResults = JSON.parse(data.Payload);
            var result = pullResults.respon[0][0];
            var correspondenceid = result["LAST_INSERT_ID()"];
            if (correspondenceid == 0){
                correspondenceid = $('#submit_newcoorespondence').attr("data-correspendence-id");
                checkstatus = 3;
            }
            var responseid = 0;
            
            for (var i = 0; i < artifacts.length; i++){
                name = artifacts[i].name;
                GUID = saveFilesName();// get GUID
                params = {Key : GUID, Body : artifacts[i], ACL: 'public-read'};
                GUID_filename[GUID] = name;

                //upload to s3 storage
                s3.upload (params, function(err,data){
                    if(err){
                        console.log(err.message);
                    }
                    else{

                        GUID = data.key;
                        name = GUID_filename[data.key];
                        sprocString = "call insert_new_files('" +name+ "','" +GUID+ "'," +correspondenceid+","+responseid+ ","+checkstatus+");";
                        checkstatus++;
                        //call lambda function and insert files
                        console.log("sprocString: "+ sprocString);
                        executeSproc(sprocString, generalcheck);
                    }
                })
            }
        }       
    }


}


function executeSproc(sprocString, callback){
        var tsting = sprocString;
        var AWS_Region = "us-west-2";
        var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 
        var payload_JSON = {"sproc": tsting }; // create JSON object for parameters for invoking Lambda function
        var payload_String = JSON.stringify(payload_JSON)
        var pullParams = { FunctionName : 'test123', Payload : payload_String }; // http://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html ref this for synchronous / asynchronous
        var pullResults; // create variable to hold data returned by the Lambda function

        lambda.invoke(pullParams, function(error, data) {
                callback(error, data);
        }); // end lambda.invoke
}

function generalcheck(err,data){
    if (err) { console.log(err);
                } 
    else {
        var pullResults = JSON.parse(data.Payload);
        var sproc_Response  = pullResults.respon[0][0].RESPONSE;
        var sproc_EventId   = pullResults.respon[0][0].Event_ID;
        console.log(sproc_Response);
        console.log(sproc_EventId);
    }
}


function populateForm_callback(error, data){
    if (error) { console.log(error);
                } else {
                    var pullResults = JSON.parse(data.Payload);
                    var result = pullResults.respon[0][0];//get data from database
                    var status = result["Status"];
                    var type = result["Type"];
                    var description = result["Description"];
                    var date = result["Sent_Date"];
                    var sentfromperson = result["Sent_From_Person"];
                    var sentfromcompany = result["Sent_From_Company"];
                    var senttoperson = result["Sent_To_Person"];
                    var senttocompany = result["Sent_To_Company"];
                    $("#Status_value").val(status).change();
                    $('input:radio[name=Type1]').filter('[value='+type+']').prop('checked', true);
                    $("#Description_value").val(description).change();
                    $("#sent_From_Person").val(sentfromperson).change();
                    $("#sent_From_Company").val(sentfromcompany).change();
                    $("#sent_To_Person").val(senttoperson).change();
                    $("#sent_To_Company").val(senttocompany).change();
                    var d = date.split("-");
                 
                    $('#dateinline').datepicker("setDate", new Date(d[2],d[1]-1,d[0]));
                    var fileslength = pullResults.respon[1].length;
                    var files = pullResults.respon[1];
                    document.getElementById('filedrop').innerHTML="";
                    for (var i =0; i<fileslength;i++){
                        var fileinfo = '<p data-exist="already-in-database"><img src="img/fileimg.png" alt="">'+ files[i]["name"];
                        document.getElementById('filedrop').innerHTML += fileinfo;
                    }
                    document.getElementById('filedrop').innerHTML += '<p style="font-size :12px">Total of ' + files.length + " files";
                    document.getElementById("outfiledrop").style.fontSize = "8px";
                    document.getElementById("filedrop").style.textAlign="";
                    document.getElementById("filedrop").style.paddingTop="";

                } // end if
}

function getinputdate(date){
    var datestring = date.getDate() + "-" + (date.getMonth() + 1) + "-" + (date.getFullYear());
    return datestring
}


//to create GUID for files(or other use)
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// create a GUID for file
function saveFilesName(files){

    var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    return guid;
}


function getSearchParams(k){
            var p = {};
            location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s,k,v){p[k]=v})
            return k?p[k]:p;
}

//to retrive data if it has a correspondence id which means if it is a select data form table
$(document).ready(function(){
    var correspondenceID = getSearchParams("correspondenceID");
    if(correspondenceID){
       $("#submit_newcoorespondence").attr("data-correspendence-id",correspondenceID);
       $("#title1").text("New Update");
       $("#h1id").text("New Update");
        var data = { UserPoolId : 'us-west-2_boi1yXUkS',
            ClientId : '28vv7qns6eobvm2rdvqino0dcu'
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('session validity: ' + session.isValid());
                var AWS_Region = "us-west-2";
                var AWS_idToken = session.getIdToken().getJwtToken();
                var AWS_Logins = {'cognito-idp.us-west-2.amazonaws.com/us-west-2_boi1yXUkS' : AWS_idToken}
                var AWS_IdentityPoolId = "us-west-2:df08250b-a24c-4a6c-826c-e3bb2ae75d63";
                var AWS_UserPoolId = "us-west-2_boi1yXUkS";
                AWS.config.region      = AWS_Region;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                        IdentityPoolId : AWS_IdentityPoolId, 
                                                Logins : AWS_Logins
                                        });
                AWS.config.credentials.get(function(){
                    retrivingdata(correspondenceID);
                }); // end credentials.get
            });
        }
        else{
            alert("Please login in");
            return;
        }
       
   }
});

//retriving data from database ************************************

function retrivingdata(correspondenceID){
    var id = correspondenceID;
    var sprocString = "call select_data(" +id+ "," +1+ ");";
    executeSproc(sprocString, populateForm_callback);
}

//logout function
function logout(){
 var data = { UserPoolId : 'us-west-2_boi1yXUkS',
                    ClientId : '28vv7qns6eobvm2rdvqino0dcu'
                };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
          
     cognitoUser.signOut();
    window.location.href = 'index.html';
    }
    else{
        alert("Please login in");
        window.location.href = 'index.html';
        return;
    }

}
