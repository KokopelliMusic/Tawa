const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

const newDBInstance = () => {

    const db = new sqlite3.Database('./data.db', (err) => {
        loadScheme(db)
        console.log('Connected to the SQlite database.')
        
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })

    return db

}

const loadScheme = (db) => {
    const sql = fs.readFileSync('./scheme.sql', 'utf8').toString()

    db.exec(sql, (err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
    })
}

module.exports = newDBInstance