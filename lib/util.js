const { v4:uuidv4 } = require("uuid");

const util = {
    /**
     * @param { String } Where
     * @param { Function } Filter
     * @returns { Promise<Array> } - A Promise that resolves to an array of items.
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
                    resove( Filter ? response.filter( Filter ) : response );
                } else {
                    resove( [] );
                }
            }).catch( reject );
        })
    },
    /**
     * @param { String } Where
     * @param { Array } Model
     * @returns { Promise<true> } - A Promise that resolves to either true.
     **/
    FirebaseSetModel: function FirebaseSetModel( Where, Model ) {
        this.config[Where] = Model;
        return !0
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
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
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
     **/
    FirebaseRemove: function FirebaseRemove( Where, Data ) {
        return new Promise( ( resove, reject ) => {
            if ( typeof Data === "object" || Data?.get_firebase_access_key ) {
                const table = Where.endsWith("/") ? ( Where + Data.get_firebase_access_key() ) : ( Where + "/" + Data.get_firebase_access_key() );
                const database = this.database.ref( table );
                database.remove().then( res => {
                    resove( ( true, res ) );
                }).catch( reject );
            } else {
                resove( false );
            }
        })
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
     **/
    FirebaseUpdate: function FirebaseUpdate( Where, Data ) {
        return new Promise( ( resove, reject ) => {
            if ( typeof Data === "object" || Data?.get_firebase_access_key ) {
                const table = Where.endsWith("/") ? ( Where + Data.get_firebase_access_key() ) : ( Where + "/" + Data.get_firebase_access_key() );
                const database = this.database.ref( table );
                delete Data.get_firebase_access_key;
                database.update( Data ).then( res => {
                    resove( ( true, res ) );
                }).catch( reject );
            } else {
                resove( false );
            }
        })
    }
}

module.exports = { util };