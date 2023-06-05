const { initializeApp, FirebaseOptions } = require("@firebase/app");
const { getDatabase, ref, get, set, remove, update } = require("@firebase/database");
const shortid = require("shortid");



class Firebase {
    /**
     * @param { string } databaseURL 
     * @return { Firebase } Database
     **/
    constructor( databaseURL ) {
        const application = getDatabase( initializeApp( { databaseURL:databaseURL } ) );
        this.ObjectModel = new Object();
        /**
         * @param { string } path
         * @param { { } } ObjectModel
         **/
        this.setModel = async ( path, ObjectModel ) => {
            if ( typeof path === "string" && typeof ObjectModel === "object" ) {
                this.ObjectModel[path] = ObjectModel;
            }
            return this
        }
        /**
         * @param { string } key
         **/
        this.getDefault = async key => {
            const database = await get( ref( application ) );
            const writeData = await database.val();
            return key ? writeData[key] : writeData;
        }
        /**
         * @param { string } path
         **/
        this.query = async path => {
            if ( typeof path !== "string" ) throw new Error("Database path error");
            const database = await (await get( ref(application,path) )).val();
            const result = new Array();
            database && Object.keys( database ).forEach( key => {
                database[key]['getToken'] = function getToken() {
                    return key;
                }
                result.push( database[key] );
            })
            return result;
        }
        /**
         * @param { string } path
         * @param { { } } data
         * @param { { } } model
         **/
        this.insert = async ( path, data ) => {
            if ( typeof path !== "string" ) throw new Error("Database path error");
            if ( typeof data !== "object" ) throw new Error("Database data error");
            const newObject = new Object();
            const model = this.ObjectModel[path];
            const token = new Date().getTime();
            if ( model ) Object.keys( model ).forEach( key => {
                model[key] === Firebase.MimeType.Primary && ( newObject[key] = shortid.generate() );
                model[key] === Firebase.MimeType.DateTime && ( newObject[key] = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"2-digit" }) );
                model[key] === Firebase.MimeType.Timestamp && ( newObject[key] = new Date().getTime() );
                data[key] && model[key] === Firebase.MimeType.Boolean && ( typeof data[key] === "boolean" && ( newObject[key] = data[key] ) );
                data[key] && model[key] === Firebase.MimeType.Object && ( typeof data[key] === "object" && ( newObject[key] = data[key] ) );
                data[key] && model[key] === Firebase.MimeType.String && ( typeof data[key] === "string" && ( newObject[key] = data[key] ) );
                data[key] && model[key] === Firebase.MimeType.Array && ( Array.isArray( data[key] ) && ( newObject[key] = data[key] ) );
                data[key] && model[key] === Firebase.MimeType.Varchar && ( newObject[key] = data[key] );
            })
            return await set( ref( application, path.endsWith("/") ? path + token : path + "/" + token ), model ? newObject : data );
        }
        /**
         * @param { string } path 
         * @param { { } } object 
         * @param { { } } model
         **/
        this.update = async ( path, object ) => {
            if ( typeof path !== "string" ) throw new Error("Database path error")
            if ( typeof object !== "object" || typeof object['getToken'] !== "function" ) throw new Error("Object key not found");
            const newObject = new Object();
            const model = this.ObjectModel[path];
            const token = object.getToken();
            if ( model ) Object.keys( model ).forEach( key => {
                object[key] && model[key] === Firebase.MimeType.Primary && ( newObject[key] = object[key] );
                object[key] && model[key] === Firebase.MimeType.DateTime && ( newObject[key] = object[key] );
                object[key] && model[key] === Firebase.MimeType.Timestamp && ( newObject[key] = object[key] );
                object[key] && model[key] === Firebase.MimeType.Boolean && ( typeof object[key] === "boolean" && ( newObject[key] = object[key] ) );
                object[key] && model[key] === Firebase.MimeType.Object && ( typeof object[key] === "object" && ( newObject[key] = object[key] ) );
                object[key] && model[key] === Firebase.MimeType.String && ( typeof object[key] === "string" && ( newObject[key] = object[key] ) );
                object[key] && model[key] === Firebase.MimeType.Array && ( Array.isArray( object[key] ) && ( newObject[key] = object[key] ) );
                object[key] && model[key] === Firebase.MimeType.Varchar && ( newObject[key] = object[key] );
            })
            return await update( ref( application, path.endsWith("/") ? path + token : path + "/" + token ), model ? newObject : data );
        }
        /**
         * @param { string } path 
         * @param { { } } object 
         **/
        this.remove = async ( path, object ) => {
            if ( typeof path !== "string" ) throw new Error("Database path error")
            if ( typeof object !== "object" || typeof object['getToken'] !== "function" ) throw new Error("Object key not found");
            return await remove( ref( application, path.endsWith("/") ? path + object.getToken() : path + "/" + object.getToken() ) );
        }
    }
    /**
     * @param { { } } object
     **/
    static Model( object ) {
        return typeof object === "object" && object
    }
    static MimeType = {
        Array: 'Array',
        String: 'String',
        Object: 'Object',
        Varchar: 'Varchar',
        Boolean: 'Boolean',
        Primary: 'Primary',
        DateTime: 'Datetime',
        Timestamp: 'Timestamp'
    }
}
module.exports = { Firebase };