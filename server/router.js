Router.map(function() {
  var isGetRequest = function(request, response) {
    var requestMethod = request.method;
    if (requestMethod !== "GET") {
      response.writeHead(405, {'Content-Type': 'text/html'});
      response.end('<html><body>Unsupported method: ' + requestMethod + '</body></html>');
      return false;
    }
    return true;
  };

  this.route('authenticate', {
    path: '/api/authenticate/applications/:applicationId',
    where: 'server',
    action: function() {
      if (!isGetRequest(this.request, this.response)) {
        return;
      }

      var token = this.request.headers["x-auth-token"];
      var applicationId = this.params.applicationId;
      var authenticatedResponse = Application.authenticatedResponse(applicationId, token);
      if (authenticatedResponse.statusCode != 200) {
        console.warn("[API] Application " + applicationId +
          " failed to authenticate with token " + token +
          " from " + JSON.stringify(this.request.headers));
      }
      this.response.writeHead(authenticatedResponse.statusCode,
        {'Content-Type': 'application/json'});
      this.response.end(JSON.stringify(authenticatedResponse));
    }
  });
});
