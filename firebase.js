
const util = {
    FirebaseFetch: function FirebaseFetch( Where, Filter ) {
        const database = this.database.ref( Where );
        const response = new Array();
        if ( typeof Filter !== "function" ) Filter = false;
        return new Promise( ( resove, reject ) => {
            database.get().then( snapshot => {
                if ( snapshot.exists() ) {
                    const SnapshotValue = snapshot.val();
                    for ( let item in SnapshotValue ) {
                        SnapshotValue[item]['get_firebase_access_key'] = () => item;
                        response.push( SnapshotValue[item] );
                    }
                    resove( Filter ? response.filter( Filter ) : response );
                } else {
                    resove( [] );
                }
            })
        })
    },
    FirebaseSetModel: function FirebaseSetModel( Where, Model ) {
        this.config[Where] = Model;
    },
    FirebaseInsert: function FirebaseInsert( Where, Data ) {
        
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
        this.config = new Object();
        // use util function
        this.fetch = util.FirebaseFetch;
        this.insert = util.FirebaseInsert;

    }
}

module.exports = { Firebase }

//https://www.facebook.com/help/1149694762461553/?helpref=uf_share