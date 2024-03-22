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
router.get("/fetchall", async (req, res) => {
  var allcars;
  try {
    const carsRef = db.collection("cars");
    const snapshot = await carsRef.get();
    const documents = [];
    snapshot.forEach((doc) => {
      // documents.push(doc.data());  
      let senddata=doc.data()
      senddata.id=doc.id
      documents.push(senddata);
    });
    // console.log(documents);
    res.json(documents);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/fetchone", async (req, res) => {
  
  try {
    const { regno }=req.body;
  console.log(regno)
    const snapshot = await db
      .collection("cars")
      .where("regno", "==", regno)
      .get(1);

      if (snapshot._size > 0) {
        const documents = [];
        snapshot.forEach((doc) => {
          documents.push(doc.data());
        });
        res.json(documents)
      }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// ROUTE 2: Add a new car using: POST "
router.post("/addcar", async (req, res) => {
  try {
    const {
      regno,
      carName,
      brand,
      imgUrl,
      price,
      description,
      speed,
      gps,
      seatType,
      automatic,
      kmsrun
    } = req.body;

    const snapshot = await db
      .collection("cars")
      .where("regno", "==", regno)
      .get(1);

    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        db.collection("cars")
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error("Error deleting document: ", error);
          });
      }); 
    }

    const Cars = db.collection("cars");

    const user = await Cars.add({
      regno: regno,
      brand: brand,
      carName: carName,
      imgUrl: imgUrl,
      price: price,
      speed: speed,
      gps: gps,
      seatType: seatType,
      automatic: automatic,
      description: description,
      kmsrun:kmsrun
    });
    console.log("this is the id " + user.id);

    res.json({ success: "new car successfully added to database" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//  delete an existing car
router.post("/deletecar", async (req, res) => {
  try {
    const { regno } = req.body;
    // Find the car and delete it
    console.log(regno)
    const snapshot = await db
      .collection("cars")
      .where("regno", "==", regno)
      .get(1);

    if (snapshot._size > 0) {
      snapshot.forEach((doc) => {
        db.collection("cars")
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error("Error deleting document: ", error);
          });
      });

      return res.json({ success: "successfully deleted" });
    }

    if (!snapshot) {
      return res.status(404).send("Not Found");
    }

    res.json({ success: "car has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
