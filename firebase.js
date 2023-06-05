
const util = {
    FirebaseFetch: function FirebaseFetch( Where, Filter ) {
        const database = this.database.ref( Where );
        const response = new Array();
        return new Promise( ( resove, reject ) => {
            database.get().then( snapshot => {
                if ( snapshot.exists() ) {
                    const SnapshotValue = snapshot.val();
                    for ( let item in SnapshotValue ) {
                        SnapshotValue[item]['Firebase_access_key'] = () => item;
                        response.push( SnapshotValue[item] );
                    }
                    resove( response );
                } else {
                    resove( [] );
                }
            })
        })
    }
}

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
            credential: init.credential,
            databaseURL: init.databaseURL
        });
        this.database = this.firebase.database();

        // use util function
        this.fetch = util.FirebaseFetch;

    }
}

module.exports = { Firebase }