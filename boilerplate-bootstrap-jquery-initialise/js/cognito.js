// var s3 = new AWS.S3({
            //     region: 'ap-southeast-2',
            //     apiVersion: '2006-03-01',
            //     params: {Bucket: 'correspendence'
            //             },

            // });

            // console.log(AWS.config.credentials.identityId);
            //get cognito ID



            // *********************************************s3 files download works
            // s3.getObject({Bucket:'correspendence' , Key: '5678.txt'},
            //     function (error, data) {
            //     if (error != null) {
            //       alert("Failed to retrieve an object: " + error);
            //     } else {
            //       alert("Loaded " + data.ContentLength + " bytes");
            //       // do something with data.body
            //     }
            //     });

            //***********************************************s3 files list works
            // s3.listObjects(function (err, data) {
            //     if (err) {
            //         document.getElementById('app').innerHTML =
            //           'Could not load objects from S3';
            //     } else {
            //         document.getElementById('app').innerHTML =
            //           'Loaded ' + data.Contents.length + ' items from S3';
            //         for (var i = 0; i < data.Contents.length; i++) {
            //             document.getElementById('app').innerHTML +=
            //               '<li>' + data.Contents[i].Key + '</li>';
            //         }
            //     }
            // });


            // AWS.config.credentials.get(function(){
                 
            //  var tstring = "select 123;";
            //     var AWS_Region = "us-west-2";
            //  var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 

            //  var p_JSON = {"sproc": tstring };
            //  var p_String = JSON.stringify(p_JSON);
            //  var pullp = { FunctionName : 'test123', Payload : p_String };
            //  var pResult;
            //  //for returning the Lambda function

            //  lambda.invoke(pullp, function(error, data) {
                        
            //             if (error) { console.log(error);
            //             } else {
            //                 var pResults = JSON.parse(data.Payload);
            //                 console.log(pResults.respon[0]);
            //             } // end if
            //     }); // end lambda.invoke
            // })

// *************************************************upload files(*works*)
// function uploadFile(albumName) {
//     var s3 = new AWS.S3({
//                 apiVersion: '2006-03-01',
//                 params: {Bucket: 'correspendence', Region: 'us-west-2'}
//                 });
//     var file = document.getElementById('fileToUpload').files[0];
//     if (file) {
//         s3.upload({Key: file.name, Body: file, ACL: "public-read"},
//         function(err, data) {
            
//             if (err) {
//                 alert("faild");
//             }
//             else {
//                 alert("Successfully uploaded");

//             }
//         });
//     }

// }


//***************************************************delete files(*works*)
// function deletefiles(albumName) {
//     var s3 = new AWS.S3({
//                 apiVersion: '2006-03-01',
//                 params: {Bucket: 'correspendence', Region: 'us-west-2'}
//                 });

//   s3.deleteObject({Key: "114598.txt"}, function(err, data) {
//     if (err) {
//       return alert('There was an error deleting your file: ', err.message);
//     }
//     alert('Successfully deleted file.');
    
//   });
// }

//***************************************new cognito user reg not using current stage
// $(document).on("click", "#register-submit", function(){
//     var firstname = $("#FirstName").val();
//     var familyname = $("#FamilyName").val();
//     var username = $("#email2").val();
//     var password = $("#password2").val();
//     var confirm_password = $("#confirm-password").val();

//     if (password == confirm_password){
//         AWSCognito.config.region = 'us-west-2';
//         var poolData = { UserPoolId : 'us-west-2_boi1yXUkS',
//                         ClientId : '28vv7qns6eobvm2rdvqino0dcu'
//                         };
//         var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
//         var attributeList = [];
//         var datafirstname = {
//                             Name : 'given_name',
//                             Value : firstname
//                         };                   
//         var datafamilyname = {
//                             Name : 'family_name',
//                             Value : familyname
//                         };  
        
//         var attributefirstname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(datafirstname);
//         var attributefamilyname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(datafamilyname);
        
//         attributeList.push(attributefirstname);
//         attributeList.push(attributefamilyname);  
             

//         userPool.signUp(username, password, attributeList, null, function(err, result){
//             if (err) {
//                 alert(err);
//                 return;
//             }
//             cognitoUser = result.user;
//             console.log('user name is ' + cognitoUser.getUsername());
//         });    
//     }
// })
//*************************connecting to the AWS and retriving data
$(document).ready(function(){
    var data = { UserPoolId : 'us-west-2_boi1yXUkS',
                    ClientId : '28vv7qns6eobvm2rdvqino0dcu'
                };
    //this is the part that defind cognito ID service provider 
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);

    var cognitoUser = userPool.getCurrentUser();// get user from cache

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
                retrivingdata();//retriving data
                
            }); // end credentials.get
        });
    }
    else{
        alert("Please login in");
        window.location.href = 'index.html';
        return;
    }
})

//logout function and return to the login page
function logout(){
 var data = { UserPoolId : 'us-west-2_boi1yXUkS',
                    ClientId : '28vv7qns6eobvm2rdvqino0dcu'
                };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
    var cognitoUser = userPool.getCurrentUser();// get current user

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

//call select_data procedure and check state is 3
function retrivingdata(){
    var id = 1;//in other case this id should be user id in the user table

    var sprocString = "call select_data(" +id+ "," +3+ ");";
    executeSproc(sprocString, populateForm_callback);
}

//lambda function invoke
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


 function populateForm_callback(error, data){

    if (error) { console.log(error);
                } 
    else {
        var pullResults = JSON.parse(data.Payload);
        var result = pullResults.respon[0];//get data from database
        var resinfo;
        var name;

        if (result.length ==0){
            // hide the the clone table which is empty and only show the no correspondence
            document.getElementById('CorresTable').style.display = 'none';
        }
        else{
            // hide the table no correspondence 
            document.getElementById('hideNoCorres').style.display = 'none';

            for (var i = 0 ; i< result.length; i++){

                var singleobject = result[i]; //result is the array that contain the selected data
                var beforeid = -999;
                if(result[i-1]){beforeid = result[i-1]["Correspondence_ID"];}
                var lastid = singleobject["Correspondence_ID"];

                var description = singleobject["Description"];
                var date = singleobject["Sent_Date"]+ "(dd/mm/yy)";
                var respon = singleobject["Respon"];
                var sentfromperson = singleobject["Sent_From_Person"];
                var senttoperson = singleobject["Sent_To_Person"];
                var senttocompany = singleobject["Sent_To_Company"];
                var agreeddep = singleobject["AgreedDep"];
                var reference = singleobject["Reference"];
                var type = singleobject["Type"];
                //the href which on click
                var location = "document.location = 'Co_Details.html?correspondenceID=" + lastid + "'";

                //convert 1 and 0 value from database to open or completed
                var status = singleobject["Status"];
                if(status == 1){status = "Open"} else{status = "Completed"};

                name = singleobject["name"];
                if(!name){name = "No file"}
                var cloneCount = i+1;
            
                //check if it is the second or more file to pop up
                if(lastid == beforeid){
                    $("#fname1").clone()
                                .attr('id','fname'+cloneCount)
                                .insertAfter($('[id^=fname]:last'))
                                .text(name);
                }
                else{
                    $("#tbody0").clone()
                                 .attr('id','tbody'+cloneCount)
                                 .insertAfter($('[id^=tbody]:last'));
                    $('[id^=description]:last').attr('id','description'+cloneCount).text(description);
                    $('[id^=date]:last').attr('id','date'+cloneCount).text(date);
                    $('[id^=respon]:last').attr('id','respon'+cloneCount).text(respon);
                    $('[id^=agreeddep]:last').attr('id','agreeddep'+cloneCount).text(agreeddep);
                    $('[id^=reference]:last').attr('id','reference'+cloneCount).text(reference);
                    $('[id^=status]:last').attr('id','status'+cloneCount).text(status);
                    $('[id^=type]:last').attr('id','type'+cloneCount).text(type);
                    $('[id^=sentfromperson]:last').attr('id','sentfromperson'+cloneCount).text(sentfromperson);
                    $('[id^=senttoperson]:last').attr('id','senttoperson'+cloneCount).text(senttoperson);
                    $('[id^=senttocompany]:last').attr('id','senttocompany'+cloneCount).text(senttocompany);
                    $('[id^=fname]:last').attr('id','fname'+cloneCount).text(name);
                    $('[id^=href]:last').attr('id','href'+cloneCount).attr('onclick',location);
                }

            }
            document.getElementById('tbody0').style.display = 'none';
        }
    }// end if
}