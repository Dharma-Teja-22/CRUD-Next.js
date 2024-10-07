import { NextResponse } from "next/server";
import db from "../config/db";

export async function GET() {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM users", (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    console.log(result, "From the GET-API");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email } = await request.json();
    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });

    console.log(result, "Data inserted successfully");
    return NextResponse.json(
      { message: "User added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { email } = await request.json();
    const result = await new Promise((resolve, reject) => {
      db.query("Select id from users where email = ?", [email], (err, res) => {
        if (res.length === 0) {
          reject(err);
        } else {
          db.query("Delete from users where email = ?", [email], (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        }
      });
    });
    // console.log(result, "User deleted successfully");
    return NextResponse.json(
      { message: "User removed successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { name, email } = await request.json();
    const result = await new Promise((resolve, reject) => {
        db.query("Select id from users where email = ?", [email], (err, res)=>{
            if(res.length!= 0)
            {
                db.query(
                    "Update users set name = ? where email = ? ",
                    [name, email],
                    (err, res) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(res);
                      }
                    }
                  );
            }
            else
            {
                console.log(err);
                reject(err);
            }
        })
     
    });

    console.log(result, "Data Updated successfully");
    return NextResponse.json(
      { message: "successfully user data updated" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
