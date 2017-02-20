[![Build Status](https://travis-ci.org/bharding2/ccbrecipe.svg?branch=master)](https://travis-ci.org/bharding2/ccbrecipe)

# CCB Recipe Portal
##### A recipe tracking and storage app

### API Documentation
#### Routes
##### Auth Routes
###### /Signup
method: POST

The signup route is used to create a new user in the database.  All passwords are hashed before being stored in the database.  The route takes a username and a password and returns a JSON webtoken.

Example usage (using httpie):
```
http POST https://ccbrecipe.herokuapp.com/api/signup username="ExampleUsername" password="ExamplePassword123"
```

###### Signin

##### Recipe Routes
##### User Routes

#### Models
##### Recipe Model

##### User Model

built under the MIT License.
