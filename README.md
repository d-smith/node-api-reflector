# XTRAC Mobile API Reflector

This provides a mock of the XTRAC (Mobile) API as described [here](http://docs.xtracmobileappapi.apiary.io/).

The application handles the sample calls as shown in the documentation. Some of
the calls have been enhanced to enable different responses based on the input -
the call variations are descibed in this documentation.

## Installation

This reflector requires [node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/). To run the reflector, first install the
dependencies via

        npm install

This is executed in the base directory of the reflector code. You may need to
configure npm proxy settings if behind an HTTP proxy. Use the npm config command
prior to `npm install` if you
need to configure proxy settings:

        npm config set proxy http://<proxy host>:<proxy port>
        npm config set https-proxy http://<proxy host>:<proxy port>

Once the dependencies are installed, run the server via `node server.js`

There are some unit tests in the tests folder - to run these install
jasmine-node (`npm install jasmine-node -g`), the execute the tests via
`jasmine-node tests`

### Docker Image

To make a docker image with the reflector, node, etc. create a directory and
clone this project into it.

    mkdir nodejs
    cd nodejs
    git clone https://github.com/d-smith/node-api-reflector.git

Create a docker file with the following contents:

    FROM ubuntu:14.04
    MAINTAINER Doug Smith "doug.smith.mail@gmail.com"
    ENV http_proxy http://10.33.50.14:8000
    ENV https_proxy http://10.33.50.14:8000
    RUN apt-get -yqq update
    RUN apt-get -yqq install nodejs npm
    RUN ln -s /usr/bin/nodejs /usr/bin/node
    ADD node-api-reflector /opt/nodeapp
    WORKDIR /opt/nodeapp
    RUN npm install
    EXPOSE 8666
    ENTRYPOINT ["nodejs", "server.js"]

Then, build the image. If you are using a vagrant guest OS when working with
docker then you would start the guest os, vagrant ssh to it, change into the
synced folder containing the files you created and staged above, then run:

    sudo docker build -t="node-api-reflector" .

Then, start a container with the image:

    sudo docker run -d -p 8666:8666 --name my-reflector node-api-reflector

## Access Tokens

[Access Tokens](http://docs.xtracmobileappapi.apiary.io/#accesstokens) can be
created or revoked.

Creating an access token via the password grant_type
requires a valid username and password. If the reflector
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
     http://vc2cmmkb026372:9002/xtrac-api/v1/oauth2/token

This will return something like:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 150
    Date: Wed, 26 Nov 2014 18:59:35 GMT
    Connection: keep-alive

    {"access_token":"5d4d3120-759e-11e4-bd97-81fd4608eff9","token_type":"Bearer","refresh_token":"5d4d3121-759e-11e4-bd97-81fd4608eff9","expires_in":3600}


Example - Invalid User Name

    curl --include \
     --request POST \
     --header "Xtrac-Tenant: baz" \
     --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
     --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
     --header "Xtrac-Previous-Access-Token: 19384972348734" \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --data-binary 'grant_type=password&client_id=foobar&client_secret=buylowsellhigh&username=notauser&password=changeme&tenant_id=acme' \
     http://vc2cmmkb026372:9002/xtrac-api/v1/oauth2/token

Will return this:

    HTTP/1.1 401 Unauthorized
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 40
    Date: Thu, 14 Aug 2014 13:59:46 GMT
    Connection: keep-alive

    {"error":"Invalid username or password"}

For obtaining an access token using a refresh token, the refresh_token grant_type
is used. If the refresh token is not the literal `expired` a new AT and RT is
returned, otherwise an error is produced.

For example, a valid call looks like:

    curl --include\
      --request POST\
      --header "Xtrac-Tenant: Acme"\
      --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39"\
      --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930"\
      --header "Xtrac-Previous-Access-Token: 19384972348734"\
      --header "Content-Type: application/x-www-form-urlencoded"\
      --data-binary 'grant_type=refresh_token&client_id=xtracmobile1&username=joeuser&refresh_token=xxx&tenant_id=acme'\
      http://localhost:8666/xtrac-api/v1/oauth2/token

      HTTP/1.1 200 OK
      X-Powered-By: Express
      Content-Type: application/json; charset=utf-8
      Content-Length: 150
      Date: Wed, 26 Nov 2014 18:57:53 GMT
      Connection: keep-alive

      {"access_token":"20431fb0-759e-11e4-bd97-81fd4608eff9","token_type":"Bearer","refresh_token":"20431fb1-759e-11e4-bd97-81fd4608eff9","expires_in":3600}

  Whereas this call will produce an error:

    curl --include\
      --request POST\
      --header "Xtrac-Tenant: Acme"\
      --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39"\
      --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930"\
      --header "Xtrac-Previous-Access-Token: 19384972348734"\
      --header "Content-Type: application/x-www-form-urlencoded"\
      --data-binary 'grant_type=refresh_token&client_id=xtracmobile1&username=joeuser&refresh_token=expired&tenant_id=acme'\
      http://localhost:8666/xtrac-api/v1/oauth2/token

      HTTP/1.1 401 Unauthorized
      X-Powered-By: Express
      Content-Type: application/json; charset=utf-8
      Content-Length: 38
      Date: Wed, 26 Nov 2014 18:56:52 GMT
      Connection: keep-alive

      {"error":"Session expired or invalid"}

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
         http://vc2cmmkb026372:9002/xtrac-api/v1/notifications

Produces:

    HTTP/1.1 200 OK
    Via: 1.0 VC2CMMKB026372 (Gateway)
    Connection: close
    X-CorrelationID: Id-02c1f4530b00000051000000e409e3cc 0
    Date: Wed, 20 Aug 2014 15:38:43 GMT
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8

    {"allItems":true,"highPriority":true,"mediumPriority":true,"lowPriority":true,"accessType":false}


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
          "accessType":false
      }
      }    ' \
       http://vc2cmmkb026372:9002/xtrac-api/v1/notifications

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

    {"allItems":false,"highPriority":true,"mediumPriority":true,"lowPriority":false,"accessType":false}


## Find Items

The reflector provides some search functionality, based on looking for memo matches
and ignoring all other criteria.

For example, this request:

    curl --include \
     --header "Xtrac-Tenant: Acme" \
     --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
     --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
     --header "Authorization: Bearer 192379878734274873847" \
     --header "Xtrac-Client-Id: xtrac-mobile-app" \
     --header "Content-Type: application/json" \
    "http://localhost:8666/xtrac-api/v1/tasks?returnFields=queue,memo,status,qctd,Priority\
    &filterCriteria=field:Priority+comparator:equal+value:high\
    &filterCriteria=field:qctd+comparator:between+value:2014-07-18T17:00:00.000Z+value:2014-07-25T17:00:00.000\
    &filterCriteria=field:status+comparator:equal+value:APPROVE\
    &filterCriteria=field:Memo+comparator:equal+value:'Ready%20for%20approval'\
    &sortFields=Priority+sort:desc,qctd+sort:desc&startRow=1&maxRows=100"

Returns:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 892
    Date: Sun, 30 Nov 2014 14:07:55 GMT
    Connection: keep-alive

    [{"workItemNo":"W000001-08AUG14",
      "jeopardy":[{"field":"QCTD","value":"2014-07-23T10:05:34.010Z","status":"RED"}],
      "fields":[
        {"field":"Memo","value":"Ready for approval"},
        {"field":"queue","value":"HIREQ"},
        {"field":"status","value":"APPROVE"},
        {"field":"Priority","value":"high"}]},
     {"workItemNo":"W000002-08AUG14",
      "jeopardy":[{"field":"QCTD","value":"2014-07-23T10:05:34.010Z","status":"RED"}],
      "fields":[
        {"field":"Memo","value":"Ready for approval"},
        {"field":"queue","value":"HIREQ"},
        {"field":"status","value":"APPROVE"},
        {"field":"Priority","value":"high"}]},
     {"workItemNo":"W000010-08AUG14",
      "jeopardy":[{"field":"QCTD","value":"2014-07-23T10:05:34.010Z","status":"RED"}],
      "fields":[
        {"field":"Memo","value":"Ready for approval"},
        {"field":"queue","value":"HIREQ"},
        {"field":"status","value":"APPROVE"},
        {"field":"Priority","value":"high"}]}]

Values that can be matched are 'Ready for approval', 'Not ready for approval',
'Ready for approval I guess', 'Ready for approval now', 'Could you approve this already',
'Ready for rejection', 'Reject-a-mundo', and 'Approve?'.

## Task Detail

There are 10 tasks that can be retrieve via the tasks/{id} resource
(W000001-08AUG14 to W000010-08AUG14), e.g.

    curl --include \
         --header "Xtrac-Tenant: Acme" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: xtrac-mobile-app" \
         --header "Content-Type: application/json" \
     http://localhost:8666/xtrac-api/v1/tasks/W000005-08AUG14


    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 247
    Date: Mon, 25 Aug 2014 14:23:50 GMT
    Connection: keep-alive

    {"workItemNo":"W000005-08AUG14",
    "fields":[{"field":"Memo","value":"Ready for approval now"},
      {"field":"queue","value":"HIREQ"},
      {"field":"QCTD","value":"2014-07-23T10:05:34.010Z"},
      {"field":"status","value":"APPROVE"},
      {"field":"priority","value":8}]}


## Locking Items

    curl --include \
       --request PUT \
       --header "Xtrac-Tenant: Acme" \
       --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
       --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
       --header "Authorization: Bearer 192379878734274873847" \
       --header "Xtrac-Client-Id: xtrac-mobile-app" \
    http://localhost:8666/xtrac-api/v1/tasks/W000010-08AUG14/lock


     curl --include \
         --request DELETE \
         --header "Xtrac-Tenant: Acme" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: xtrac-mobile-api" \
     http://localhost:8666/xtrac-api/v1/tasks/W000010-08AUG14/lock

## Approve/Reject An Item

A very simple simulation of approve/reject is in place. In a nutshell you need
to lock once of the available items as described above, then submit an
approve/reject PUT that includes the action and note attributes in the body.

     curl --include \
         --request PUT \
         --header "Xtrac-Tenant: Acme" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: xtrac-mobile-app" \
         --header "Content-Type: application/json" \
         --data-binary '{
        "action":"approved",
        "note":"Looks good"
    }' \
         http://localhost:8666/xtrac-api/v1/tasks/W000010-08AUG14


## Retrieve Documents

Currently, there are two document IDs that will work with any work item id.
A document id of 1 will return a PDF document, and a document id of 2
will return a text document. Any other document id will return a 404 not found
response with an API error body.

Examples:

    curl --include \
         --header "Xtrac-Tenant: Acme" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: xtrac-mobile-app" \
     http://localhost:8666/xtrac-api/v1/tasks/W123456-01JAN01/documents/2


    HTTP/1.1 200 OK
    X-Powered-By: Express
    Content-Type: application/octet-stream
    Content-Length: 2588
    Date: Wed, 27 Aug 2014 22:26:09 GMT
    Connection: keep-alive

    Hipster Ipsum | Artisanal filler text for your site or project.

    Fap mixtape meh, fashion axe freegan shabby chic 3 wolf moon Tonx gastropub
    leggings art party. Tofu tousled flannel, single-origin coffee polaroid cornhole
    trust fund Bushwick authentic pug narwhal Wes Anderson kogi quinoa typewriter.
    Bespoke kitsch artisan irony Portland Banksy put a bird on it Carles Pitchfork,
    organic before they sold out. Leggings ennui fap chambray, butcher
    cray vinyl cornhole you probably haven't heard of them messenger bag next
    level distillery food truck bicycle rights. Quinoa put a bird on it hella
    tofu bespoke cornhole wolf. Pinterest ethnic organic, gluten-free chillwave
    flannel photo booth Thundercats fashion axe. Tote bag meggings 8-bit organic,
    post-ironic Blue Bottle street art craft beer sartorial.

    Next level photo booth Portland, Echo Park normcore artisan bespoke 8-bit
    leggings Marfa. Sartorial Bushwick aesthetic pickled tote bag. Cardigan gentrify
    Pinterest photo booth lo-fi Bushwick polaroid, keffiyeh wayfarers narwhal.
    VHS 3 wolf moon chillwave cliche fixie lo-fi Etsy, Cosby sweater Williamsburg
    meh bicycle rights street art. Occupy readymade asymmetrical, Tonx locavore
    Tumblr ennui McSweeney's. Vinyl quinoa blog gluten-free, keffiyeh YOLO occupy
    tote bag mumblecore PBR. Keytar chillwave tousled, crucifix try-hard
    seitan post- ironic tote bag trust fund chia lo-fi Austin dreamcatcher ugh
    disrupt.

    Squid American Apparel bitters YOLO. Gastropub aesthetic small batch keffiyeh
    Tumblr, Williamsburg church-key mixtape Wes Anderson American Apparel ennui
    locavore post-ironic. Plaid 3 wolf moon brunch meh iPhone Pinterest cornhole
    roof party, sustainable photo booth messenger bag. Ugh bespoke Vice retro
    meggings. Art party banh mi photo booth, Williamsburg quinoa plaid vinyl
    selfies Etsy. Intelligentsia Portland Godard readymade. Etsy Tonx synth
    skateboard sartorial trust fund disrupt small batch, Marfa seitan McSweeney's.

    Keytar gentrify slow-carb trust fund four loko Cosby sweater put a bird on it
    wayfarers bicycle rights church-key banh mi Pitchfork. +1 mustache semiotics
    meggings Tumblr, deep v ugh small batch Etsy. Sartorial Williamsburg cardigan,
    plaid Vice artisan gastropub Etsy aesthetic. Umami Intelligentsia butcher Banksy
    hoodie. Farm-to-table plaid Brooklyn next level, hashtag kitsch you probably
    haven't heard of them Truffaut master cleanse. Before they sold out forage
    Blue Bottle, Vice fingerstache quinoa swag art party Tonx 90's. Sartorial Carles
    keffiyeh, put a bird on it quinoa raw denim Pitchfork Tonx Austin keytar
    letterpress.

    curl --include \
         --header "Xtrac-Tenant: Acme" \
         --header "Xtrac-Device-Id: C59FAAE0-11CE-450A-844A-A5C498DC8A39" \
         --header "Xtrac-Request-Id: B9A1E888-EAC9-4538-A2C2-CBB00C56B930" \
         --header "Authorization: Bearer 192379878734274873847" \
         --header "Xtrac-Client-Id: xtrac-mobile-app" \
     http://localhost:8666/xtrac-api/v1/tasks/W123456-01JAN01/documents/3

    HTTP/1.1 404 Not Found
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 64
    Date: Wed, 27 Aug 2014 22:26:56 GMT
    Connection: keep-alive

    {"error":"Requested document for the given work item not found"}
