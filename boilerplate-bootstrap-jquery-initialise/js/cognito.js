$(document).on("click", "#submit1", function(){
    //var username1 = $("#username1").val();
    

	var password1 = $("#password1").val();
	var userEmail = $("#email1").val();
	var AWS_userpoolID = "us-west-2_boi1yXUkS";
	var AWS_clientID = "28vv7qns6eobvm2rdvqino0dcu";

	var authenticationData = {Username : userEmail, Password : password1};
	var UserPoolData = { UserPoolId : AWS_userpoolID, ClientId : AWS_clientID };
	var userPool  = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(UserPoolData); 

	var userData = {Username : userEmail, Pool : userPool};
	var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
	var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
	//for user pool login
	
	cognitoUser.authenticateUser(authenticationDetails, {

		onSuccess:  function(result){
			
			// console.log("accessToken: "+JSON.stringify(result.accessToken));
            // console.log("idToken: "+JSON.stringify(result.idToken));
            // console.log("refreshToken: "+JSON.stringify(result.refreshToken));
            //for testing with console.log

            var AWS_idToken = result.getIdToken().getJwtToken();
            //get user pool id

            var AWS_Region = "us-west-2";
            var AWS_IdentityPoolId = "us-west-2:df08250b-a24c-4a6c-826c-e3bb2ae75d63";
            var AWS_UserPoolId = "us-west-2_boi1yXUkS";
            
            var AWS_Logins = {'cognito-idp.us-west-2.amazonaws.com/us-west-2_boi1yXUkS' : AWS_idToken}

            AWS.config.region = AWS_Region;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                    IdentityPoolId : AWS_IdentityPoolId, 
                                            Logins : AWS_Logins
                            		});
            alert("Login success");

            // var s3 = new AWS.S3({
            //     region: 'ap-southeast-2',
            //     apiVersion: '2006-03-01',
            //     params: {Bucket: 'correspendence'
            //             },

            // });
            



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
            // 	// var tstring = "call insert_new_correspondence(1,'Email','this is description','2017-3-1', 'this is file path', 'Jone','ISGM', 'Jason','Telstra',1);";
            // 	var tstring = "select 123;";
            //     var AWS_Region = "us-west-2";
            // 	var lambda = new AWS.Lambda({region: AWS_Region, apiVersion: '2015-03-31'}); 

            // 	var p_JSON = {"sproc": tstring };
            // 	var p_String = JSON.stringify(p_JSON);
            // 	var pullp = { FunctionName : 'test123', Payload : p_String };
            // 	var pResult;
            // 	//for returning the Lambda function

            // 	lambda.invoke(pullp, function(error, data) {
                        
            //             if (error) { console.log(error);
            //             } else {
            //                 var pResults = JSON.parse(data.Payload);
            //                 console.log(pResults.respon[0]);
            //             } // end if
            //     }); // end lambda.invoke
            // })
		},
		newPasswordRequired: function(userAttributes, requiredAttributes){
                        var newPassword = prompt('Enter new password ' ,'');
                        cognitoUser.completeNewPasswordChallenge(newPassword, [], this);
                    },

		onFailure: function(err) {
			
                        alert(err);
        }
	})
})

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
$(document).on("click", "#register-submit", function(){
    var firstname = $("#FirstName").val();
    var familyname = $("#FamilyName").val();
    var username = $("#email2").val();
    var password = $("#password2").val();
    var confirm_password = $("#confirm-password").val();

    if (password == confirm_password){
        AWSCognito.config.region = 'us-west-2';
        var poolData = { UserPoolId : 'us-west-2_boi1yXUkS',
                        ClientId : '28vv7qns6eobvm2rdvqino0dcu'
                        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var attributeList = [];
        var datafirstname = {
                            Name : 'given_name',
                            Value : firstname
                        };                   
        var datafamilyname = {
                            Name : 'family_name',
                            Value : familyname
                        };  
        
        var attributefirstname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(datafirstname);
        var attributefamilyname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(datafamilyname);
        
        attributeList.push(attributefirstname);
        attributeList.push(attributefamilyname);  
             

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });    
    }
})

