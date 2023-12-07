'use strict';

window.addEventListener('load', () => {
	loadLoginForm();
});

function loadSignupForm() {
	let registerSection = document.getElementById('register-section');
	let loginForm = document.getElementById('login-form');

	if (registerSection.contains(loginForm)) {
		registerSection.removeChild(loginForm);
	}

	let registrationForm = `
        <div class="container" id="registration-form">
            <h1>Register a new Account</h1>
            <form class="form" action="/auth/signup" method="POST">
                <label for="name">Name</label>
                <input type="text" name="name" id="name" />
                <label for="email">Email</label>
                <input type="email" name="email" id="email" />
                <label for="password">Password</label>
                <input type="password" name="password" id="password" />
                <label for="passwordConfirm">Confirm Password</label>
                <input type="password" name="passwordConfirm" id="passwordConfirm" />
                <input type="hidden" name="_csrf" value="<%csrf_token%>">
                <input type="submit" value="Sign Up" />
            </form>
            <div class="register-cta">
                <p>Already have an account? <span id="signin" onclick="loadLoginForm()">Sign In</span></p>
            </div>
        </div>
    `;

	registerSection.insertAdjacentHTML('afterbegin', registrationForm);
}

function loadLoginForm() {
	let registerSection = document.getElementById('register-section');
	let registrationForm = document.getElementById('registration-form');

	if (registerSection.contains(registrationForm)) {
		registerSection.removeChild(registrationForm);
	}

	let loginForm = `
        <div class="container" id="login-form">
            <h1>Login to your Account</h1>
            <form class="form" action="/auth/login" method="POST">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" />
                <label for="password">Password</label>
                <input type="password" name="password" id="password" />
                <input type="hidden" name="_csrf" value="<%=csrfToken%>">
                <input type="submit" value="Login" />
            </form>
            <div class="register-cta">
                <p>Don't have an account? <span id="signup" onclick="loadSignupForm()">Sign Up</span></p>
            </div>
        </div>
    `;

	registerSection.insertAdjacentHTML('afterbegin', loginForm);
}

function clear() {
	let registerSection = document.getElementById('register-section');
	let registrationForm = document.getElementById('registration-form');

	if (registerSection.contains(registrationForm)) {
		registerSection.removeChild(registrationForm);
	}
}
