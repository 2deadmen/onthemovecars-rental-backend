const express = require("express");

const { ContactUsPage } = require("./sendEmail");
const router = express.Router();

const firebase = require("firebase-admin");
const otpGenerator = require("otp-generator");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  DocumentReference,
} = require("firebase-admin/firestore");
const { body, validationResult } = require("express-validator");
const { collection } = require("../firebaseConfig");

const db = getFirestore();
//get all bookings
//for admin only
router.get("/fetchall", async (req, res) => {
  var allcars = [];
  try {
    const carsRef = db.collection("booking");
    const snapshot = await carsRef.get();
    snapshot.forEach((doc) => {
      allcars.push(doc.data());
    });
    res.json(allcars);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//get all active bookings
router.get("/fetchallactive", async (req, res) => {
  var allcars = [];
  try {
    const carsRef = db.collection("active-booking");
    const snapshot = await carsRef.get();
    snapshot.forEach((doc) => {
      allcars.push(doc.data());
    });
    res.json(allcars);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new car using: POST "
router.post("/bookcar", async (req, res) => {

  try {
    let { regno, name, email, start_date, end_date, phone, address, licensce } =
      req.body;

    console.log(req.body);

    const snapshot = await db
      .collection("active-booking")
      .where("regno", "==", regno)
      .get();
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    // console.log(start_date < end_date)
    // if (snapshot._size > 1) {
    //   return res.status(400).send("all slots are full");
    // }
    let samecars = [];
    // console.log(snapshot);
    snapshot.forEach((docs) => {
      samecars.push(docs.data());
    });

    // console.log(start_date ,doc.end_date.toDate())
    if (snapshot._size > 0) {
      
      let samecars_a = [];
      let samecars_b = [];
      //separate records basedn on start_date
      samecars.forEach((element) => {
        if (start_date > element.start_date.toDate()) {
          samecars_a.push(element);
        } else {
          samecars_b.push(element);
        }
      });
      //checking if some end_date exceeds current start_date to check overlapping
      if (samecars_a.length > 0) {
        samecars_a.forEach((element) => {
          console.log('here')
          if (start_date < element.end_date.toDate()) {
            return res.status(201).send({
              error:
                "this car is booked from  " +
                element.start_date.toDate() +
                "till" +
                element.end_date.toDate(),
            });
          }
        });
      }
      //check if some start_date overlaps with current end_date
      if (samecars_b.length > 0) {
        samecars_b.forEach((element) => {
          console.log("hhhh ")
          if (end_date > element.start_date.toDate()) {
            return res.status(201).send({
              error:
                "this car is booked from  " +
                element.start_date.toDate() +
                "till" +
                element.end_date.toDate(),
            });
          }
        });
      }
    }

    const hash = otpGenerator.generate(6);
    //await sendotpEmail({ toUser: email, hash });
    const Book = db.collection("active-booking");
    const Booklog = db.collection("booking");
    //this is to indicate booked or idle on the frontend
    let booked = samecars.length;

    //adding data to permanent table
    await Booklog.add({
      regno: regno,
      customer_name: name,
      email: email,
      phone: phone,
      address: address,
      start_date: start_date,
      end_date: end_date,
      licensce: licensce,
      ride_completed: false,
    });

    //adding it to active bookings table
    const book = await Book.add({
      regno: regno,
      customer_name: name,
      email: email,
      phone: phone,
      address: address,
      start_date: start_date,
      end_date: end_date,
      licensce: licensce,
      approved: false,
      otp: hash,
    });
    console.log("this is the id " + book.id);

    return res.json({ booked, end_date });
  } catch (error) {
    // res.status(500).send({ error: error.message });
  }
});

//  delete an existing booking
router.post("/deletebooking", async (req, res) => {
  try {
    const { id } = req.body;

    await db.collection("active-booking").doc(id).delete();

    return res.json({ success: "successfully deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/contactus", async (req, res) => {
  try {
    const { user, email, info } = req.body;
    const data = await ContactUsPage(user, email, info);
    if (data === true) {
      res.json({ success: "email sent successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
