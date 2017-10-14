


var DBConnection
var userController
var changeUser

$(document).ready(function () {
    $("#datefield").datepicker();


    $('.remove-user-bill-split').each(function (index, element) {
        $(element).click(function () {
            $(element).parent().remove();
        })
    })

    $('#add-user-bill-split').click(function () {
        var string = '<div class="user-bill debitor"><select onchange="changeUser(this)">'
        string += '<option selected disabled hidden>Pick a User</option>'

        usersAvailable.forEach(function(user, index) {
            string += '<option value="' + user.id + '">' + user.firstname + " " + user.lastname + "</option>"
        })

        string += '</select></div>'

        $(this).before(string)
        $('#add-user-bill-split').css('display', 'none');
    })

    removeUser = function(element) {
        var userID = $(element).siblings('input').val();

        var user = users.filter(function(user){
            return user.id == userID
        })[0];

        usersAvailable.push(user)

        $(element).parent().remove();

        if (usersAvailable.length == 0) {
            $('#add-user-bill-split').css('display', 'none');
        } else {
            $('#add-user-bill-split').css('display', 'inline-block');
        }
    }

    changeUser = function(element) {
        var userID = $(element).find(":selected").val();
        var name = $(element).find(":selected").text();
        var debitors = $('.debitor').length
        var newElements = '<span>' + name + '</span><span class="fa fa-times" onclick="removeUser(this)"></span><div class="role">spliter</div>'
        newElements += '<input class="form-control" type="hidden" style="display:inline-block; width:auto;" readonly="readonly" name="users[debtor]['+ (debitors - 1) +']" value="' + userID + '">'
        usersAvailable = usersAvailable.filter(function(user){
            return user.id != userID
        })

        $(element).after(newElements);
        $(element).remove();

        if (usersAvailable.length == 0) {
            $('#add-user-bill-split').css('display', 'none');
        } else {
            $('#add-user-bill-split').css('display', 'inline-block');
        }
        
    }


    DBConnection = function() {
        this.getUsers = function () {

            var theResponse = null
            return $.ajax({
                url: "../api/users",
                type: "GET",
                success: function (response, status, http) {
                    if (response) {
                        console.log(response)
                        theResponse = response
                    }
                }
            }).done(function () {
                return theResponse
            })
        }
    }

    userController = function(users) {
        this.selected = []
        this.available = users

        this.addSelection = function(user) {
            this.selected.push(user)

            this.available = this.available.filter(function(availableUser) {
                return availableUser.id != user.id
            })
        }

        this.removeSelection = function(user) {
            this.selected = this.selected.filter(function(selectedUser) {
                return selectedUser.id != user.id
            })

            this.available.push(user)
        }
    }
})