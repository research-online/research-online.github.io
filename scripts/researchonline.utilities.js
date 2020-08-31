var ResearchOnlineUtil = {
    Constants: {
        inresearchLabel: "youth.in.research",
        otreeParticipantLabel: "participant_label",
        noReference: "NOCODE"
    },

    retrieveRef: function () {
        var ref = (new URLSearchParams(window.location.search)).get("rev");
        if (ref) {
            return ref;
        }

        return this.Constants.noReference;
    },

    /* no need for high level of crypto randomness */
    getRandomString: function (length) {
        var chars = "023456789ABCDEFGHIJKLMNPQRSTUVWXTZabcdefghikmnopqrstuvwxyz".split('');
        var val = [];
        for (var i = 0; i < length; i++) {
            val[i] = chars[Math.floor(Math.random() * chars.length)];
        }
        return val.join("");
    },

// what=unique_random_value;howLong=number of days of validity
    forgetMeNot: function (what, howLong) {
        var d = new Date();
        d.setTime(d.getTime() + (howLong * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = this.Constants.inresearchLabel + "=" + what + ";" + expires + ";path=/;SameSite=Strict;secure=true;";
    },

// Retrieved the value of a cookie with name=cname
    beenHereBefore: function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },


    accessSurvey: function (obj) {
        var ref = this.retrieveRef();
        var beenHere = this.beenHereBefore(this.Constants.inresearchLabel);
        if (beenHere) {
            ref = ref + "_" + beenHere;
        } else {
            var newMe = this.getRandomString(10);
            this.forgetMeNot(newMe, 180);
            ref = ref + "_" + newMe;
        }

        var newUrl = new URL(obj.href);
        var search_params = newUrl.searchParams;
        search_params.set(this.Constants.otreeParticipantLabel, ref);
        newUrl.search = search_params.toString();

        obj.href = newUrl.toString();
    },

    /**
     * Collects all the url parameters in the query string and returns them in base64 encoding
     *
     * @param optionalIdentifier is an optional string that will be added to the encoded set of parameters as: &optionalParameter
     * @returns {string} Base64 encoded string
     */
    collectAndEncodeUrlParameters: function (optionalIdentifier) {
        var queryString = (new URLSearchParams(window.location.search)).toString();

        // If the page is called with URL parameters, they are collected
        if (queryString) {
            // If the function is called with optionalIdentifier containing a value, the value will be added to the string
            // that will be base64 encoded. It is possible to pass additional values assigning them in URL form to optionalIdentifier.
            // ex: optionalIdentifier="provider=myProvider&acct=9999&valid=true" and these values will be concatenated to the page URL
            if (optionalIdentifier) {
                queryString += "&" + optionalIdentifier; // each URL parameter must be separated by &
            }
        } else {
            if (optionalIdentifier) {
                queryString = optionalIdentifier; // there is no need to add & if optionalIdentifier is the only string
            }
        }

        return btoa(queryString);
    },

    /**
     * Checks if the parameter is a string or an Anchor (<a href=destinationURL>) object.
     * If the value is a string it will only redirect the current page to the survey URL, adding the parameters in the URL
     * as base64 value in participant_label.
     * If the value is an Anchor object, it will update the Anchor href with the base64 encoding of the page URL and it will
     * also redirect the current page to the URL of the survey, with a parameter participant_label containing the
     * base64 of the url parameters of the current page.

     * @param destinationRef Checks if the parameter is a string in which case it will use it as the destination URL or if it is
     * an <a> object, in which case it will use its href attribute to form the redirection URL.
     * @param optionalParam is an optional parameter that can be used to add values to the base64 string that will be passed as participant_label
     */
    updateButtonAndRedirectToSurvey: function (destinationRef, optionalParam) {
        var destinationURL;
        // Check if the parameter is not empty
        if (destinationRef) {
            // Check if the received parameter is a reference to an <a> link
            if (destinationRef.href) {
                // it is an <a> object
                destinationURL = destinationRef.href;
            } else {
                // it is a string
                destinationURL = destinationRef;
            }


            // Creating the final URL + participant_label
            var newUrl = new URL(destinationURL);
            var search_params = newUrl.searchParams;
            search_params.set(this.Constants.otreeParticipantLabel, this.collectAndEncodeUrlParameters(optionalParam));
            newUrl.search = search_params.toString();

            // If we received an Anchor object, we update its href attribute
            // in case the automatic redirection won't work we ask the user to click the button
            // for the redirection
            if(destinationRef.href) {
                destinationRef.href = newUrl.toString();
            }

            // In both cases, we will try to redirect to the survey
            window.location.replace(newUrl.toString());
        }

    }
};
