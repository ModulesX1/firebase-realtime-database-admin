const { util } = require("./lib/util");

class Firebase {
    /**
     * Function config Firebase real-time database
     * @param { Object } init Object only
     * @param { { } } init.credential JSON account service key
     * @param { String } init.databaseURL URL Firebase real-time database
     */
    constructor( init ) {
        this.firebase = require("firebase-admin");
        this.firebase.initializeApp({
            credential: this.firebase.credential.cert( init.credential ),
            databaseURL: init.databaseURL
        });
        this.database = this.firebase.database();
        this.config = new Object();
        this.fetch = util.FirebaseFetch;
        this.insert = util.FirebaseInsert;
        this.remove = util.FirebaseRemove;
        this.update = util.FirebaseUpdate;
        this.setModel = util.FirebaseSetModel;
    }
}

module.exports = { Firebase };