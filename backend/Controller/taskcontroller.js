const pool = require('../Config/db');
const dotenv = require('dotenv')
const jsonwebtoken = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { sql } = require('googleapis/build/src/apis/sql');

dotenv.config();

const addingtask = async (req, res) => {

  try {
    const { name, date, description, priority } = req.body
    console.log("The data we received is: ", { name, date, description, priority });
    const token = req.headers.authorization?.split(' ')[1];
    console.log("The token is: ", token)
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      })
    }
    const decoding = jsonwebtoken.verify(token, process.env.JWTSECRET);
    const userId = decoding.id;
    console.log("The user id is: ", userId)
    if (!name || !date || !description || !priority) {
      return res.status(400).send({
        success: false,
        message: "Bro uncomplete requiest"
      })
    }
    const sql_query = 'INSERT INTO Tsk (user_id,title,description,priority,date) values (?,?,?,?,?)';
    const values = [userId, name, description, priority, date];
    const [result] = await pool.execute(sql_query, values);
    if (result.affectedRows > 0) {
      return res.status(201).send({
        success: true,
        message: "Task added successfully"
      })
    }
  }
  catch (error) {
    console.log("The task not added");
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Cannot add the task sorry for that.",
      error: error.message
    })
  }
}



const gettingtask = async (req, res) => {
  try {
    const { userid } = req.params;

    console.log("Fetching task list for user ID:", userid);

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: "Incomplete request: User ID is missing.",
      });
    }

    const query = `SELECT * FROM Tsk WHERE user_id = ?`;
    const values = [userid];

    const [rows] = await pool.execute(query, values);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching tasks.",
      error: error.message,
    });
  }
};



const updatetask = async (req, res) => {
  try {
    const { taskid } = req.params;
    if (!taskid) {
      return res.status(400).json({
        success: false,
        message: "No task id provided"
      });
    }

    const { title, date, description, priority, userid } = req.body;

    if (!title || !date || !description || !priority || !userid) {
      return res.status(400).json({
        success: false,
        message: "Please provide userid, title, description, date, and priority"
      });
    }

    const sqldateformat = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

    const query = `
        UPDATE Tsk
        SET title = ?, description = ?, date = ?, priority = ?
        WHERE id = ? AND user_id = ?
      `;

    const values = [title, description, sqldateformat, priority, taskid, userid];

    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching task found in the database"
      });
    }

    return res.status(200).json({
      success: true,
      message: "The task is successfully updated"
    });

  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing update",
      error: error.message
    });
  }
};


const deletetask = async (req, res) => {
  try {
    const { taskid } = req.params;
    const { userid } = req.body;
    console.log("The task id we got for deleting the task is:", { taskid });
    if (!taskid || !userid) {
      return res.status(401).send({
        success: false,
        message: "The task id or user is not defined"
      })
    }

    const query = 'DELETE FROM Tsk where id = ? and user_id = ?';
    const values = [taskid, userid];

    const [result] = await pool.execute(query, values);
    if (result.affectedRows > 0) {
      return res.status(200).send({
        success: true,
        message: "Task deleted",
      })
    }
  }
  catch (error) {
    console.log("There is an error bro", error);
    return res.status(400).json({
      success: false,
      message: "There is an error from backend",
      error: error.message
    })
  }
}


const gettingrecomend = async (req, res) => {
  try {
    const { userid } = req.params;
    console.log("The user id is: ", userid);

    if (!userid) {
      return res.status(400).send({
        success: false,
        message: "No user ID provided"
      });
    }

    const query = `
  SELECT * FROM Tsk 
  WHERE user_id = ? 
  AND DATE(date) >= CURDATE()
  ORDER BY priority ASC, DATE(date) ASC
  LIMIT 3
`;

    const [rows] = await pool.execute(query, [userid]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No recommended tasks found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Recommended tasks fetched",
      data: rows
    });

  } catch (error) {
    console.error("There is an error:", error);
    return res.status(500).json({
      success: false,
      message: "Backend error while fetching recommendations",
      error: error.message
    });
  }
};

module.exports = { addingtask, gettingtask, updatetask, deletetask, gettingrecomend }