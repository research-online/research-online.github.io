let SessionManagement = {
    sessionsCSV: undefined,

    validateCode: function (session_type) {
        let code = document.getElementById("confirm_code_text").value;
        let validSession = SessionManagement.sessionsCSV.data.filter(sess => sess.code === code && sess.type === session_type);
        let countSessions = validSession.length;
        console.log("Count of Sessions with same code: " + countSessions);
        if (countSessions === 1) {
            // If the code is for a valid session we show the access button and hide the code elements
            document.getElementById("goToSurveyLink").href = validSession[0].url;
            document.getElementById("welcome_text").innerText = validSession[0].details;
            document.getElementById("access_session_section").classList.remove('d-none');
            document.getElementById("session_code_section").classList.add('d-none');
            ResearchOnlineUtil.accessSurvey(document.getElementById("goToSurveyLink"));

        } else if (countSessions === 0) {
            let error_message = document.getElementById("error_message");
            error_message.innerText = "Invalid Session Code. Try again";
            error_message.classList.remove('d-none');
        } else {
            let error_message = document.getElementById("error_message");
            error_message.innerText = "More than one session with the same code. Contact Elisa";
            error_message.classList.remove('d-none');
        }
    },

    checkSessionCode: function (code) {
        console.log("Checking code " + code);
        let sessions = SessionManagement.sessionsCSV.data.filter(sess => sess.Code === code);
        console.log(sessions.length)
        if (sessions.length !== 1) {
            let error_message = document.getElementById("error_message");
            error_message.innerText = "More than one session with the same code. Contact Elisa";
            error_message.classList.remove('d-none');
            return null;
        }

        return sessions[0]
    },

    loadCSV: function (csvFile) {
        console.log("Loading CSV " + csvFile)
        Papa.parse(csvFile, {
            header: true,
            download: true,
            complete: function (results) {
                // Save loaded CSV values in memory
                console.log("Loading OK. [" + results.data.length + "] elements found")
                SessionManagement.sessionsCSV = results;
                if (results.data.length === 1) {
                    // 1 element is the header. An Empty CSV will be of size 1
                    let error_message = document.getElementById("error_message");
                    error_message.innerText = "No Session found to be loaded. Contact support. [Empty CSV]";
                    error_message.classList.remove('d-none');
                }
                let confirm_code_btn = document.getElementById("confirm_code_btn");
                let confirm_code_text = document.getElementById("confirm_code_text");
                confirm_code_btn.disabled = false;
                confirm_code_text.disabled = false;
            },
            error: function (error, file) {
                let error_message = document.getElementById("error_message");
                error_message.innerText = "No Session found to be loaded. Contact support. [" + error + "]";
                error_message.classList.remove('d-none');
            }
        });
    },


}