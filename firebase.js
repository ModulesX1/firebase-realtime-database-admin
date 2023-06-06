const { v4:uuidv4 } = require("uuid");

const util = {
    /**
     * @param { String } Where
     * @param { Function } Filter
     **/
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
                    response.exists = true;
                    resove( Filter ? response.filter( Filter ) : response );
                } else {
                    response.exists = false;
                    resove( [] );
                }
            }).catch( reject );
        })
    },
    /**
     * @param { String } Where
     * @param { Array } Model
     **/
    FirebaseSetModel: function FirebaseSetModel( Where, Model ) {
        this.config[Where] = Model;
        return !0
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     **/
    FirebaseInsert: function FirebaseInsert( Where, Data ) {
        const uuid = uuidv4();
        const table = Where.endsWith("/") ? `${Where}${uuid}` : `${Where}/${uuid}`;
        const dataModel = this.config[Where];
        const database = this.database.ref( table );
        return new Promise( ( resove, reject ) => {
            if ( typeof Data !== "object" ) resove( false );
            if ( !dataModel ) {
                database.set( Data ).then( (res) => {
                    resove( ( true, res ) );
                }).catch( reject );
            } else {
                const newData = new Object();
                dataModel.forEach( key => {
                    newData[key] = Data[key]
                });
                database.set( newData ).then( (res) => {
                    resove( ( true, res ) );
                }).catch( reject );
            }
        });
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     **/
    FirebaseRemove: function FirebaseRemove( Where, Data ) {
        return new Promise( ( resove, reject ) => {
            if ( typeof Data === "object" || Data.get_firebase_access_key ) {
                const table = Where.endsWith("/") ? ( Where + Data.get_firebase_access_key() ) : ( Where + "/" + Data.get_firebase_access_key() );
                const database = this.database.ref( table );
                database.remove().then( res => {
                    resove( ( true, res ) );
                }).catch( reject );
            } else {
                resove( false );
            }
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
        this.config = new Object();
        // use util function
        this.fetch = util.FirebaseFetch;
        this.insert = util.FirebaseInsert;
        this.setModel = util.FirebaseSetModel;
        this.remove = util.FirebaseRemove;
        
    }
}

module.exports = { Firebase };

//https://www.facebook.com/help/1149694762461553/?helpref=uf_share