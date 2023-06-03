const { type } = require("os");
const util = require("./lib/util");

class Firebase {
    /**
     * @param { Object } init
     * @param { { } } init.credential
     * @param { String } init.databaseURL
     */
    constructor( init ) {
        this.firebase = require("firebase-admin");
        this.firebase.initializeApp({
            credential: this.firebase.credential.cert( init.credential ),
            databaseURL: init.databaseURL
        });

        this.insert = util.insert;
        this.query = util.query;
    }
}

const sql = new Firebase({
    credential: {
        "type": "service_account",
        "project_id": "slimedatabase-realtime",
        "private_key_id": "bbcea4a46dda7251b2edd581d1c524e7b1b037b1",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC7rWe0j1TjrJBI\nOWKGEUFOlvtVZUP8njy3WP6FgGE3t0No7HN6rUmFyGqYD7ZbVAMLq1ahFeA9wxeN\n5ujc2NcvJth4LBUjUccauOIQlV+0TbxEhgsTMZNwfjZITf9uwN4IYOG7XNeMV94E\nHY29s3UZBvBTMEtguKU3UOvSlQNaTAWDD073KM2ZeCSY3OGIzcShxQjCk+VMiK6D\nHaRBKWQPhVDqEyTlCPTQP0rK3ScT+bBVF2fsqcSqz4cb3beKat/YHFeMUnRlYfwW\njcMs5WamDWjSm7GX6oMXffB2Cx/29eN5FXk9rVqZtL7FgdXIrYuaPY9c4SBow0bZ\nOLYN1IVFAgMBAAECggEAI73dbyyQzR8zBx4unjuxBUeJq/SyIuz7wSsopcISQasc\nImJNh8JyqxDFBBqR7wir39AMmnbxErIRzUt5c320VV1/gjta9zP+yB8HpoLcDBl1\nzlL8zvX1D0pqChEYoT4Hyu6wbp86yZZ+SKhcMxF3LoH8yMr8v/nKNSOrFZqdXdej\nAKVUyFUvBicglP1UZA/SNpSxvT0DNhHdktHYEf2tHjPbJEsWu4kOb0LBd7i6vyt9\nNl21uK8ZvfibBIt08odtX2FIOMvrrMMYMvoKOJZJ8JYbFJ5JP9UgURaCMgNA8plV\n1B1mR07aliMZs7Zd8C1oqKCDkPuHPa06gS+FYSSOLQKBgQDfKy4cuf5v5y57CjBu\nXoz8CKEdM/+aPkR1uJWDJKJ9N7Uw44wglewTrxggPdCSShlMJRwlFOAwhxO+Ub6S\nqKfXmvZBpxyDdyfbxcWfa21j3ZmMLa/WizbxX6yjFZGvf7Ha7uy7LbEUSP59V5zy\njNp5ebbI8RELpOcN+fL603Kt1wKBgQDXSZOX+zPF9+ZKhtHVfNOjUjbtbMLtJ2Qf\nwOIINtkWePMHLvNA9+ITEVXArtj3KYkrhJy5KfA2hm0ai0QDWK2PGpLyTo2d4yff\nQKz1U3o3HA4iHwmO/eJ5p27IAKMOq+7Cdtp79f68+P33SQN6Gk1XXz8ApGa16s0k\niX5+pRpqQwKBgCoACGejoX0R9y901XSQGtx8C0ZhuOMggOXe3VSXGnWSfGk9CexA\nCvQRaer3dz9w7p3kBg38hczcPxz8aW9UinILWfk1KCqdzESSTgUYxLecxv8YwhUQ\nkkCPDwCKWKa8044ulSMNEFyO+EZCrOkBFUTzYTEkHV8ho9J/jfkivlx1AoGAcj0A\nrK0HlA0vjmxr/DT4uLlvnB0ScnVsk8zuJB22pE4Z573qJpdix2tzbYNabg0EVKtR\n3o96f/RlAKjVtlDgCAe54gn868MV7UmMfcGGIKgqd8CwecgO3S8Tgd2UqLxjPZ2D\n4jNusSgO26FKzwgV8j8AV37lYbLumGy9SsahdbECgYBXV88QsHj2OaOqexdx3fiA\nUVRYUuMGF6zSWp3zmZphvydR3g6xmOTPV7QVfdSWwqGROMA1TvTXM6hS9YLCF8wt\nNazyA/QsvFjVjIp9TZ7jojbKGAXIxzzY9rrnG7P4/Z+AvZCQhJzlJRb94vT79MIL\nS82kwYGYhVeAcMztocOeYw==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-259wz@slimedatabase-realtime.iam.gserviceaccount.com",
        "client_id": "117734610205495541565",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-259wz%40slimedatabase-realtime.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    },
    databaseURL: "https://slimedatabase-realtime-default-rtdb.asia-southeast1.firebasedatabase.app"
});

sql.query("/members").then( snapshots => {
    snapshots.forEach( console.log )
})