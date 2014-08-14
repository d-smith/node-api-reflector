# XTRAC Mobile API Reflector

This provides a mock of the XTRAC (Mobile) API as described [here](http://docs.xtracmobileappapi.apiary.io/).

The application handles the sample calls as shown in the documentation. Some of
the calls have been enhanced to enable different responses based on the input -
the call variations are descibed in this documentation.

## Installation

This reflector requires node.js and npm. To run the reflector, first install the dependencies via

        npm install

This is executed in the base directory of the reflector code. You may need to
configure npm proxy settings if behind an HTTP proxy.

Once the dependencies are installed, run the server via `node server.js`


## Access Tokens

[Access Tokens](http://docs.xtracmobileappapi.apiary.io/#accesstokens) can be created or revoked.

Creating an access token requires a valid username and password. If the reflector receives a request with a usename of `notauser`, the error for invalid user name or password is returned.

Otherwise, an access token is returned.

Example - Valid Input

    MACLB015803:~ a045103$ curl --include \
    >        --request POST \
    >        --header "Xtrac-Tenant: Acme" \
    >        --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
    >        --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
    >        --header "Xtrac-Previous-Access-Token: 19384972348734" \
    >        --header "Content-Type: application/x-www-form-urlencoded" \
    >        --data-binary 'grant_type=password&client_id=xtracmobile1&client_secret=foo&username=joeuser&password=changeme&tenant_id=acme' \
    >        http://localhost:8666/v1/xtrac/oauth2/token
    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 55
    Date: Thu, 14 Aug 2014 13:56:53 GMT
    Connection: keep-alive

    {"access_token":"d88ce8c0-23ba-11e4-b81c-d143e3344f75"}


Example - Invalid User Name

    MACLB015803:~ a045103$ curl --include \
    >      --request POST \
    >      --header "Xtrac-Tenant: Acme" \
    >      --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
    >      --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
    >      --header "Xtrac-Previous-Access-Token: 19384972348734" \
    >      --header "Content-Type: application/x-www-form-urlencoded" \
    >      --data-binary 'grant_type=password&client_id=xtracmobile1&client_secret=foo&username=notauser&password=changeme&tenant_id=acme' \
    >      http://localhost:8666/v1/xtrac/oauth2/token
    HTTP/1.1 401 Unauthorized
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 40
    Date: Thu, 14 Aug 2014 13:59:46 GMT
    Connection: keep-alive

    {"error":"Invalid username or password"}
