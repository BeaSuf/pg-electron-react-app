const { Pool } = require('pg');
// const types = require('pg-types');
// const moments = require('moment');

console.log(process.env.DATABASE_URL)
const connectionString = `${process.env.DATABASE_URL}?ssl=true`; //configured at .profile

// const connectionString = "postgres://ttfymeaazxtebj:578b40e0396165c135f0834c98f780a2623838a482ee378caff1a982336c0b09@ec2-23-21-177-102.compute-1.amazonaws.com:5432/dd0rndg6fsl9q5?ssl=true";

const pool = new Pool({
  connectionString
});

// const parseFn = val => {
//     console.log(val);
//     const res = val === null ? null : val;
    
//     return res;
// } 

// types.setTypeParser(1184, parseFn)

const query = (sql, params) => {
  return pool.query(sql, params);
}

// query("select * from users;").then(res => console.log(res.rows)).catch(e => console.log(e))

export default query;