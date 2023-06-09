const { v4:uuidv4 } = require("uuid");

const util = {
    /**
     * @param { String } Where
     * @param { Function } Filter
     * @returns { Promise<Array> } - A Promise that resolves to an array of items.
     **/
    FirebaseFetch( Where, Filter ) {
        const database = this.database.ref( Where );
        const response = new Array();
        if ( typeof Filter !== "function" ) Filter = false;
        return new Promise( ( resolve, reject ) => {
            database.get().then( snapshot => {
                if ( snapshot.exists() ) {
                    const SnapshotValue = snapshot.val();
                    for ( let item in SnapshotValue ) {
                        SnapshotValue[item]['get_firebase_access_key'] = () => item;
                        response.push( SnapshotValue[item] );
                    }
                    resolve( Filter ? response.filter( Filter ) : response );
                } else {
                    resolve( [] );
                }
            }).catch( reject );
        })
    },
    /**
     * @param { String } Where
     * @param { Array } Model
     * @returns { Promise<true> } - A Promise that resolves to either true.
     **/
    FirebaseSetModel( Where, Model ) {
        this.config[Where] = Model;
        return !0
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
     **/
    FirebaseInsert( Where, Data ) {
        const uuid = uuidv4();
        const table = Where.endsWith("/") ? `${Where}${uuid}` : `${Where}/${uuid}`;
        const dataModel = this.config[Where];
        const database = this.database.ref( table );
        return new Promise( ( resolve, reject ) => {
            if ( typeof Data !== "object" ) resolve( false );
            if ( !dataModel ) {
                database.set( Data ).then( (res) => {
                    resolve( ( true, res ) );
                }).catch( reject );
            } else {
                const newData = new Object();
                dataModel.forEach( key => {
                    newData[key] = Data[key]
                });
                database.set( newData ).then( (res) => {
                    resolve( ( true, res ) );
                }).catch( reject );
            }
        });
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
     **/
    FirebaseRemove( Where, Data ) {
        return new Promise( ( resolve, reject ) => {
            if ( typeof Data === "object" || Data?.get_firebase_access_key ) {
                const table = Where.endsWith("/") ? ( Where + Data.get_firebase_access_key() ) : ( Where + "/" + Data.get_firebase_access_key() );
                const database = this.database.ref( table );
                database.remove().then( res => {
                    resolve( ( true, res ) );
                }).catch( reject );
            } else {
                resolve( false );
            }
        })
    },
    /**
     * @param { String } Where
     * @param { {} } Data
     * @returns { Promise<boolean> } - A Promise that resolves to either true or false.
     **/
    FirebaseUpdate( Where, Data ) {
        return new Promise( ( resolve, reject ) => {
            if ( typeof Data === "object" || Data?.get_firebase_access_key ) {
                const table = Where.endsWith("/") ? ( Where + Data.get_firebase_access_key() ) : ( Where + "/" + Data.get_firebase_access_key() );
                const database = this.database.ref( table );
                delete Data.get_firebase_access_key;
                database.update( Data ).then( res => {
                    resolve( ( true, res ) );
                }).catch( reject );
            } else {
                resolve( false );
            }
        })
    }
}

module.exports = { util };