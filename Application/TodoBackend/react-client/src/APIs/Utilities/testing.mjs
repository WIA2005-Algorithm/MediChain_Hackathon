import axios from "axios";
axios.defaults.baseURL = "http://localhost:8080/api";
const payloads = [
  /* UMMC */
  // DOCTORS
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QDOCUMMC",
      password: "Kamal@2001",
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Jay",
      middleName: "Zachary",
      lastName: "Peterson",
      email: "jay200120011@gmail.com",
      DOB: new Date(1972, 6, 23),
      gender: "Male",
      maritalStatus: "Single",
      department: "ENT",
      passport: "QDOCUMMC"
    },
    address: {
      street1: "7 Bloka1 Pusat Dagang Setia Jaya Jln Lama",
      street2: "Pusat Dagang Setia Jaya Petaling Jaya",
      postcode: "47300",
      country: "Malaysia",
      state: "Selangor",
      city: "Petaling Jaya"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QDOC2UMMC",
      password: "Kamal@2001",
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Stephen",
      middleName: "Steve",
      lastName: "Peterson",
      email: "steve200120011@gmail.com",
      DOB: new Date(1989, 6, 23),
      gender: "Male",
      maritalStatus: "Married",
      department: "Psychology",
      passport: "QDOCUMMC"
    },
    address: {
      street1: "7 Bloka1 Pusat Dagang Setia Jaya Jln Lama",
      street2: "Pusat Dagang Setia Jaya Petaling Jaya",
      postcode: "47300",
      country: "Malaysia",
      state: "Selangor",
      city: "Petaling Jaya"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  // PATIENTS
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QPTUMMC",
      password: "Kamal@2001",
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Kaiya",
      middleName: "Sew",
      lastName: "Yu",
      email: "Kaiya11@hotmail.com",
      DOB: new Date(1992, 12, 23),
      gender: "Female",
      maritalStatus: "Single",
      passport: "QPTUMMC"
    },
    address: {
      street1: "8th Floor, Plaza Magnum, Kuala Lumpur",
      street2: "Wilayah Persekutuan",
      postcode: "47300",
      country: "Malaysia",
      state: "Wilayah Persekutuan",
      city: "Kuala Lumpur"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  /* PPUM */
  // DOCTORS
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QDOCPPUM",
      password: "Kamal@2001",
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Shelby",
      middleName: "Zachary",
      lastName: "Rollins",
      email: "shellby200120011@gmail.com",
      DOB: new Date(1985, 6, 23),
      gender: "Male",
      maritalStatus: "Married",
      department: "Neurology",
      passport: "QDOCPPUM"
    },
    address: {
      street1: "7 Bloka1 Pusat Dagang Setia Jaya Jln Lama",
      street2: "Pusat Dagang Setia Jaya Petaling Jaya",
      postcode: "47300",
      country: "Malaysia",
      state: "Selangor",
      city: "Petaling Jaya"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QDOCPPUM",
      password: "Kamal@2001",
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Jeffrey",
      middleName: "Harrison",
      lastName: "Rollins",
      email: "jeff200120011@gmail.com",
      DOB: new Date(1990, 6, 23),
      gender: "Male",
      maritalStatus: "Married",
      department: "Ophthalmology",
      passport: "QDOCPPUM"
    },
    address: {
      street1: "7 Bloka1 Pusat Dagang Setia Jaya Jln Lama",
      street2: "Pusat Dagang Setia Jaya Petaling Jaya",
      postcode: "47300",
      country: "Malaysia",
      state: "Selangor",
      city: "Petaling Jaya"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  // PATIENTS
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QPTPPUM",
      password: "Kamal@2001",
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Jacob",
      middleName: "Zachary",
      lastName: "Tyler",
      email: "jtyler200120011@gmail.com",
      DOB: new Date(1999, 6, 23),
      gender: "Male",
      maritalStatus: "Single",
      passport: "QPTPPUM"
    },
    address: {
      street1: "7 Bloka1 Pusat Dagang Setia Jaya Jln Lama",
      street2: "Pusat Dagang Setia Jaya Petaling Jaya",
      postcode: "47300",
      country: "Malaysia",
      state: "Selangor",
      city: "Petaling Jaya"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  }
];
const onBehalf = false;

(function postRequests() {
  payloads.every(async (payloadData) => {
    await axios.post("/entity/addNewPatient/onBehalf", {
      payloadData,
      onBehalf
    });
  });
})();
