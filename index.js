const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

const mongoDBConnectionString =
  "mongodb+srv://SE12:CSH2024@cluster0.fiy894w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoDBConnectionString)
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// Schema and model for Teacher

const teacherSchema = new mongoose.Schema({
  name: { type: String },
  subject: { type: String },
  roomNum: { type: Number },
  email: { type: String },
  dayofWeek: { type: String },
});

// const ItemSchema = new teacherSchema({description:{type: String}});

teacherSchema.index({ name: "text" });

// app.get("/", (req, res) => {

//   let searchQuery = req.query.search || '';

//   let searchFilter = {};
//   if (searchQuery.length > 0) {
//     searchFilter = { $text: { $search: searchQuery
//                             }}
//   }
//   ItemS.find(searchFilter).then(items => res.json(items))
// })

const Teacher = mongoose.model("Teacher", teacherSchema);

const studentSchema = new mongoose.Schema({
  name: { type: String },
  grade: { type: Number },
  email: { type: String },
});

const Student = mongoose.model("Student", studentSchema);

const appointmentSchema = new mongoose.Schema(
  {
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    Date: { type: Number },
  },
  { timestamps: true },
);
const Appointment = mongoose.model("Appointment", appointmentSchema);
app.get("/", (req, res) => {
  Teacher.find({}).then((data) => {
    // change the response to render inventory.ejs
    res.render("appointment.ejs", { items: data });
  });
});


app.get("/teachers", (req, res) => {
  Teacher.find({}).then((data) => {
    // change the response to render inventory.ejs
    res.render("appointment.ejs", { items: data });
  });
});

app.get("/students", async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    const students = await Student.find({});
    const appointments = await Appointment.find({}).populate('teacher_id').populate('student_id')
console.log(appointments)

    res.render("students.ejs", { teachers, students, appointments });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

app.post("/add", (req, res) => {
  const app = Appointment({
    name: req.body.name,
    grade: req.body.grade,
    email: req.body.email,
  });

  app
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
});

app.get("/student", (req, res) => {
  Student.findOne({}).then((data) => {
    res.json(data);
  });
});

app.get("/teachers", async (req, res) => {
  
  Teacher.find({}).then((data) => {
    res.render("teachers.ejs", { items: data });
  });
});

// const murrayApp = require(__dirname + '/routes/mr.murray.js');
// app.use('/murray', murrayApp );

app.get("/students", async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    const students = await Student.find({});
    const appointments = await Appointment.find({}).populate('teacher_id').populate('student_id')
console.log(appointments)

    res.render("students.ejs", { teachers, students, appointments });
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});


app.post("/student", (req, res) => {
  const newStudent = new Student({
    name: req.body.name,
    grade: req.body.grade,
    email: req.body.email,
  });
  newStudent.save().then((student) => res.json(student));
});

app.post("/teacher", (req, res) => {
  const newTeacher = new Teacher({
    name: req.body.name,
    subject: req.body.subject,
    roomNum: req.body.roomNum,
    email: req.body.email,
    dayofWeek: req.body.dayofWeek,
  });

  newTeacher.save().then((teacher) => res.json(teacher));
});

app.get("/appointment", (req, res) => {
  Appointment.find({}).then((data) => {
    // change the response to render inventory.ejs
    res.render("appointment.ejs", { items: data });
  });
});

// app.get("/teacher/:teacherName/appointments", async (req, res) => {
//   const teacherName = req.params.teacherName;

//   try {
//     const teacher = await Teacher.findOne({ name: teacherName });

//     if (!teacher) {
//       return res.status(404).send("Teacher not found");
//     }

//     const appointments = await Appointment.find({
//       teacher_id: teacher._id,
//     }).populate("student_id"); // Populate student references

//     res.json(appointments); // Send the appointments as JSON response
//   } catch (err) {
//     res.status(500).send("Error fetching appointments for teacher");
//   }
// });

app.post("/appointment", (req, res) => {
  const newAppointment = new Appointment({
    student_id: req.body.student_id,
    teacher_id: req.body.teacher_id,
    date: req.body.date,
  });
  newAppointment.save().then((appointment) => res.json(appointment));
});

app.delete("/student/:name", (req, res) => {
  const name = req.params.name;
  Student.findOneDelete({ name: name }).then((data) => {
    res.json(data);
  });
});
app.get("/teacher/:teacher_id", (req, res) => {
  const teachID = req.params.teacher_id
  
  Appointment.find({teacher_id:teachID}).populate('student_id').populate('teacher_id')
    .then((data) => {
    res.render("teachApp.ejs", { items: data });

  });
})
// function setExpirationDate(days) {
//   let currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + days);
//   return currentDate;
// }

// // Example: Set expiration date 7 days from now
// let expirationDate = setExpirationDate(7);
// console.log("Expiration Date:", expirationDate);
// localStorage.setItem("expirationDate", expirationDate.toISOString());
// function isExpired() {
//   let storedExpirationDate = new Date(localStorage.getItem("expirationDate"));
//   let currentDate = new Date();

//   return currentDate > storedExpirationDate;
// }

// // Example: Check if expired
// if (isExpired()) {
//   console.log("The expiration date has passed.");
// } else {
//   console.log("The expiration date has not yet passed.");
// }



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
