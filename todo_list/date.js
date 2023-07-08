
exports.getdate = function(){
    var today = new Date();

    const options = {
     weekday:"long",
     month:'long',
     day:"numeric"
   
    }
     

 return today.toLocaleDateString("us-en",options);

}

exports.getday = function(){
    var today = new Date();

    const options = {
     weekday:"long",
    }
     

 return today.toLocaleDateString("us-en",options);

}


