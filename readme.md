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

Response:

```
{ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w' }
```

###### /Signin
method: GET

The signin route is used to access users already in the database.  The response is a JSON webtoken.

Example usage (using httpie):
```
http GET https://ccbrecipe.herokuapp.com/api/signin username="ExampleUsername" password="ExamplePassword123"
```

Response:

```
{ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiaWF0IjoxNDc4OTc5MTc4fQ.JB5gC7TLxMoTvzXP8oKC50Oi6YQJ4R6R9YWn5V_fB4w' }
```

##### Recipe Routes
##### User Routes

#### Models
##### Recipe Model
##### User Model

built under the MIT License.
