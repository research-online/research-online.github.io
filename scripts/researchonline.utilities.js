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
            var newMe = this.forgetMeNot(this.getRandomString(10), 90);
            ref = ref + "_" + newMe;
        }

        var newUrl = new URL(obj.href);
        var search_params = newUrl.searchParams;
        search_params.set(this.Constants.otreeParticipantLabel, ref);
        newUrl.search = search_params.toString();

        obj.href = newUrl.toString();
    }
};
