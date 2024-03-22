//admin routes

const express = require("express");
const router = express.Router();
const firebase = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  DocumentReference,
} = require("firebase-admin/firestore");
const { body, validationResult } = require("express-validator");
const { collection } = require("../firebaseConfig");

const db = getFirestore();
// ROUTE 1: Get All the cars using:
router.get("/fetchnumbers", async (req, res) => {

  try {
//cars details  
    const carsRef = db.collection("cars");
    const snapshot = await carsRef.get();
    const cars = [];
    snapshot.forEach((doc) => {
      cars.push(doc.data());
    });
//user details
const usersRef = db.collection("users");
    const snapshot1 = await usersRef.get();
    const users = [];
    snapshot1.forEach((doc) => {
      users.push(doc.data());
    });

//all booking details
const bookRef = db.collection("booking");
    const snapshot2 = await bookRef.get();
    const bookings = [];
    snapshot2.forEach((doc) => {
      bookings.push(doc.data());
    });

    const activebookRef = db.collection("active-booking");
    const snapshot3 = await activebookRef.get();
    const activebookings = [];
    snapshot3.forEach((doc) => {
      let senddata=doc.data()
      senddata.id=doc.id
      activebookings.push(senddata);
    });

    // console.log(documents);
    res.json({cars:cars,users:users,book:bookings,activebook:activebookings});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// router.get("/fetch-activebook", async (req, res) => {

//   try {
// //active booking details
//     const booksRef = db.collection("active-booking");
//     const snapshot = await booksRef.get();
//     const books = [];
//     snapshot.forEach((doc) => {
//       books.push(doc.data());
//     });


//     // console.log(documents);
//     res.json(books);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
