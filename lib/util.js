
/**
 * @param {*} inital 
 * @return { boolean<true|false> }
 */
function checkIsObject( inital ) {
    return typeof inital === "object" ? !0 : !1;
}

/**
 * @param { String } table 
 * @param { {} } value 
 * @return { Promise<{}> }
 */
async function insertData( table, value ) {
    const database = this.firebase.database();
    const ref = database.ref( table );
    return await ref.set( value )
}

/**
 * @param { * } table 
 * @return { Promise<Array> }
 */
async function queryData( table ) {
    const response = new Array();
    const database = this.firebase.database();
    const ref = database.ref( table );
    return new Promise( ( success ) => {
        ref.get().then( snapshots => {
            if ( snapshots.exists() ) {
                const obj = snapshots.val();
                for ( let key in obj ) {
                    obj[key]['firebase_realtime_database_admin_token'] = () => key;
                    response.push( obj[key] );
                }
                success( response );
            } else {
                success( [] );
            }
        })
    });
}

const util = {
    isObject: checkIsObject,
    insert: insertData,
    query: queryData
}

module.exports = util;
