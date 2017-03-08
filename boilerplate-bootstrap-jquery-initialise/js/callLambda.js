$(document).on("click", "#submit_newcoorespondence", function(){


    var statusValue = $("#Status_value option:selected").val();
    var typeValue = $("#type_value input:checked").val();
    var descriptionValue = $("#Description_value").val();
    var dateValue = getinputdate($("#dateinline").datepicker('getDate'));
    var sentFromPerson = $("#sent_From_Person").val();
    var sentFromCompany = $("#sent_From_Company").val();
    var sentToPerson = $("#sent_To_Person").val();
    var sentToCompany = $("#sent_To_Company").val();


    


    var checkstatus = 1;//for further checking user ID

    var sprocString = "call insert_new_correspondence(" +statusValue+ ",'" +typeValue+ "','" +descriptionValue+ "','" +dateValue+ "','" +sentToPerson+ "','" +sentToCompany+ "','" +sentFromPerson+ "','" +sentFromCompany+ "'," +checkstatus+ ");"; 

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
                insertdata(sprocString);
            }); // end credentials.get

        });
    }
    else{
        alert("Please login in");
        return;
    }

});

function insertdata(sprocString){
        var tsting = sprocString;
        var AWS_Region = "us-west-2";
        var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 

        var payload_JSON = {"sproc": tsting }; // create JSON object for parameters for invoking Lambda function
        var payload_String = JSON.stringify(payload_JSON)
        var pullParams = { FunctionName : 'test123', Payload : payload_String }; // http://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html ref this for synchronous / asynchronous
        var pullResults; // create variable to hold data returned by the Lambda function

        lambda.invoke(pullParams, function(error, data) {

                if (error) { console.log(error);
                } else {
                    var pullResults = JSON.parse(data.Payload);
                    var sproc_Response  = pullResults.respon[0][0].RESPONSE;
                    var sproc_EventId   = pullResults.respon[0][0].Event_ID;
                    console.log(sproc_Response);
                    console.log(sproc_EventId);
                    insertfiles();
                } // end if
        }); // end lambda.invoke

}

function insertfiles(){
    var inputlength = document.getElementById('input4').files.length;
    if (inputlength != 0 ) {
        var artifacts = saveFilesName(document.getElementById('input4').files);
        //working stop point 8/3/2017 5:23*****************************************************
    }

}

function getinputdate(date){
    var datestring = date.getDate() + "-" + (date.getMonth() + 1) + "-" + (date.getFullYear());
    return datestring
}


//to create GUID for files(or other use)
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 

function saveFilesName(files){

    var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

}




