const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mark42',
    database: 'gridev'
});


function updateFactor(chargeDiff)
{
    const sql = 'UPDATE user_data SET correction_factor = ? WHERE username = ?';

    // Execute the query
    connection.query(sql, [correctionFactor, username], (error, results, fields) => {
        if (error) {
            console.error('Error updating user correction factor:', error);
            return;
        }
        console.log('User correction factor updated successfully');
    });
}

const username ='name'
const correctionFactor = 1;

// Call the function to update the correction factor for the user
updateFactor(username, correctionFactor);