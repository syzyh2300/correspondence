$(document).on("click", "#submit_newcoorespondence", function(){
    var statusValue = $("#Status_value option:selected").val();
    var typeValue = $("#type_value input:checked").val();
    var descriptionValue = $("#Description_value").val();
    var dateValue = getinputdate($("#dateinline").datepicker('getDate'));
    var sentFromPerson = $("#sent_From_Person").val();
    var sentFromCompany = $("#sent_From_Company").val();
    var sentToPerson = $("#sent_To_Person").val();
    var sentToCompany = $("#sent_To_Company").val();




    // 3/2/2017 working stop point *********************************************************************************
    if (document.getElementById('input4').files.length != 0 ) {
        var artifacts = saveFilesName(document.getElementById('input4').files);
    }
    else if(document.getElementById('filedrop').files.length != 0 ){
        var artifacts = saveFilesName(document.getElementById('filedrop').files)
    }
    


    debugger;

    // var sprocString = "call insert_new_correspondence(" + statusvalue + "," + typevalue + ",";
    var sprocString = "select 123;";
    var executeSproc = function(sprocString, callBack){

    var AWS_Region = "us-west-2";    
    var AWS_Logins = {'cognito-idp.us-west-2.amazonaws.com/us-west-2_boi1yXUkS' : AWS_idToken}
    var AWS_IdentityPoolId = "us-west-2:df08250b-a24c-4a6c-826c-e3bb2ae75d63";
    var AWS_UserPoolId = "us-west-2_boi1yXUkS";

    AWS.config.region      = AWS_Region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                    IdentityPoolId : AWS_IdentityPoolId, 
                                            Logins : AWS_Logins
                                    });


    AWS.config.credentials.get(function(){

            var tsting = sprocString;
            debugger;
            var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 
            var payload_JSON = {"sproc": sprocString }; // create JSON object for parameters for invoking Lambda function
            var payload_String = JSON.stringify(payload_JSON)
            var pullParams = { FunctionName : 'Event-App-Mysql', Payload : payload_String }; // http://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html ref this for synchronous / asynchronous
            var pullResults; // create variable to hold data returned by the Lambda function

            lambda.invoke(pullParams, function(error, data) {

                    if (error) { console.log(error);
                    } else {
                        var pullResults     = JSON.parse(data.Payload);

                        callBack(pullResults.respon[0]);
                    } // end if
            }); // end lambda.invoke
        }); // end credentials.get
    };
})

function getinputdate(date){
    var datestring = date.getDate() + "-" + (date.getMonth() + 1) + "-" + (date.getFullYear());
    return datestring
}

