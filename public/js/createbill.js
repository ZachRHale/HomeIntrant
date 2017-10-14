
var db = null
var users = null
var usersAvailable = null

$(document).ready(function() {
    db = new DBConnection();
    users = ''
    db.getUsers().done(function(data){ 
        users = JSON.parse(data)
        usersAvailable = users

    })
})


// div(class="user-bill")
// span Bob Smith
// i(class="fa fa-times remove-user-bill-split" aria-hidden="true")
// input(type='hidden' style="display:inline-block; width:auto" readonly class="form-control" name = "users[debtor][0]" value = '92fbebcc-ba93-c594-9b4b-adb09329f3d8') 
// div(class="user-bill")
// span Joe Roma
// i(class="fa fa-times remove-user-bill-split" aria-hidden="true")
// input(type='hidden' style="display:inline-block; width:auto" readonly class="form-control" name = "users[debtor][1]" value = '8ba15e7b-d09c-202a-5d7d-ea08cd154d2a') 