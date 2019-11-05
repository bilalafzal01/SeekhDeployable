$(document).ready(function() {
    // Getting references to our form and input
    var signUpForm = $("form.register-form");
    var emailInput = $("#email-input");
    var passwordInput = $("#password-input");
    var usernameInput = $("#username-input");
    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
        username: usernameInput.val().trim(),
        email: emailInput.val().trim(),
        password: passwordInput.val().trim()
      };
  
      if (!userData.username || !userData.email || !userData.password) {
        return;
      }
      // If we have an email and password, run the signUpUser function
      signUpUser(userData.username, userData.email, userData.password);
      // usernameInput.val("");
      // emailInput.val("");
      // passwordInput.val("");
    });
  
    // Does a post to the signup route. If succesful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(username,email, password) {
      $.post("/register", {
        username: username,
        email: email,
        password: password
      }).then(function(data) {
        $('body').replaceWith(data);
        console.log("in the post of regscript!");
        // If there's an error, handle it by throwing up a boostrap alert
      }).catch(handleLoginErr,function(){
        console.log("not working duh!");
      });
    }
  
    function handleLoginErr(err) {
      $("#alert .msg").text(err.responseJSON);
      $("#alert").fadeIn(500);
    }
  });
  