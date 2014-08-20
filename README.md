# XTRAC Mobile API Reflector

This provides a mock of the XTRAC (Mobile) API as described [here](http://docs.xtracmobileappapi.apiary.io/).

The application handles the sample calls as shown in the documentation. Some of
the calls have been enhanced to enable different responses based on the input -
the call variations are descibed in this documentation.

## Installation

This reflector requires node.js and npm. To run the reflector, first install the
dependencies via

        npm install

This is executed in the base directory of the reflector code. You may need to
configure npm proxy settings if behind an HTTP proxy.

Once the dependencies are installed, run the server via `node server.js`

There are some unit tests in the tests folder - to run these install
jasmine-node (`npm install jasmine-node -g`), the execute the tests via
`jasmine-node tests`

## Access Tokens

[Access Tokens](http://docs.xtracmobileappapi.apiary.io/#accesstokens) can be
created or revoked.

Creating an access token requires a valid username and password. If the reflector
receives a request with a usename of `notauser`, the error for invalid user name
or password is returned.

Otherwise, an access token is returned.

Note when the reflector is fronted with the Axway API Server and the policies
we use for the API, the client id and secret are checked prior to the call
flowing through to the server. The Xtrac-Tenant header is also validated.

Example - Valid Input


    curl --include \
     --request POST \
     --header "Xtrac-Tenant: baz" \
     --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
     --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
     --header "Xtrac-Previous-Access-Token: 19384972348734" \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --data-binary 'grant_type=password&client_id=foobar&client_secret=buylowsellhigh&username=joeuser&password=changeme&tenant_id=acme' \
     http://vc2cmmkb026372:9002/v1/xtrac/oauth2/token

This will return something like:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 55
    Date: Thu, 14 Aug 2014 13:56:53 GMT
    Connection: keep-alive

    {"access_token":"d88ce8c0-23ba-11e4-b81c-d143e3344f75"}


Example - Invalid User Name

    curl --include \
     --request POST \
     --header "Xtrac-Tenant: baz" \
     --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
     --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
     --header "Xtrac-Previous-Access-Token: 19384972348734" \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --data-binary 'grant_type=password&client_id=foobar&client_secret=buylowsellhigh&username=notauser&password=changeme&tenant_id=acme' \
     http://vc2cmmkb026372:9002/v1/xtrac/oauth2/token

Will return this:

    HTTP/1.1 401 Unauthorized
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 40
    Date: Thu, 14 Aug 2014 13:59:46 GMT
    Connection: keep-alive

    {"error":"Invalid username or password"}

## Notification Settings

The reflector provides in-memory storage for the settings, so default values are
written into memory on POST, and updated on PUT.

If the reflector is fronted by Axway, valid Xtrac-Tenant and Xtrac-Client-Id
headers must also be supplied.

Example - initial POST:

    curl --include \
         --request POST \
         --header "Xtrac-Tenant: baz" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: foobar" \
         --header "Content-Type: application/json" \
         --data-binary '{
        "uuid":"30D3E8BD-BB59-4B10-8CAE-ADE87045F5A8",
        "user":"Joe",
        "platformNotifications":true,
        "deviceToken":"29z6j5c4df46f809505189c4c83fjcgf7f6257e98542d2jt3395kj73",
        "deviceType":"iOS"
    }' \
         http://vc2cmmkb026372:9002/v1/xtrac/notifications

Produces:

    HTTP/1.1 200 OK
    Via: 1.0 VC2CMMKB026372 (Gateway)
    Connection: close
    X-CorrelationID: Id-02c1f4530b00000051000000e409e3cc 0
    Date: Wed, 20 Aug 2014 15:38:43 GMT
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8

    {"allItems":true,"highPriority":true,"mediumPriority":true,"lowPriority":true,"workAccess":false}


After submitting an update:

    curl --include \
       --request PUT \
       --header "Xtrac-Tenant: baz" \
       --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
       --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
       --header "Authorization: Bearer 192379878734274873847" \
       --header "Xtrac-Client-Id: foobar" \
       --header "Content-Type: application/json" \
       --data-binary '{
      "uuid":"30D3E8BD-BB59-4B10-8CAE-ADE87045F5A8",
      "user":"Joe",
      "notificationSettings": {
          "allItems":false,
          "highPriority":true,
          "mediumPriority":true,
          "lowPriority":false,
          "workAccess":false
      }
      }    ' \
       http://vc2cmmkb026372:9002/v1/xtrac/notifications

The next post will then reflect back the updated preferences, e.g. if the POST
above is resubmitted (with a unique request id) then the following
response shows the updated preferencesL

    HTTP/1.1 200 OK
    Via: 1.0 VC2CMMKB026372 (Gateway)
    Connection: close
    X-CorrelationID: Id-bcc6f4531a000000510000000f4fb1ab 0
    Date: Wed, 20 Aug 2014 16:03:08 GMT
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8

    {"allItems":false,"highPriority":true,"mediumPriority":true,"lowPriority":false,"workAccess":false}
