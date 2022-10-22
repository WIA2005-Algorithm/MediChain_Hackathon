import axios from "axios";
const org1AdminID = "Admin";
const org2AdminID = "BAdmin";
const commonPassword = "Kamal@2001";


axios.defaults.baseURL = "http://localhost:8080/api";
const payloads = [
  /* UMMC */
  // DOCTORS
  // Jay Zachery Peterson (QDOCUMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QDOCUMMC",
      password: commonPassword,
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
  // Stephen Steve Peterson (QDOC2UMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QDOC2UMMC",
      password: commonPassword,
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
      passport: "QDOC2UMMC"
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
  // Stephenie Trevor Peterson (QDOC3UMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QDOC3UMMC",
      password: commonPassword,
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Stehenie",
      middleName: "Trevor",
      lastName: "Peterson",
      email: "heniesteve200120011@gmail.com",
      DOB: new Date(1980, 6, 23),
      gender: "Female",
      maritalStatus: "Single",
      department: "Ophthalmology",
      passport: "QDOC3UMMC"
    },
    address: {
      street1: "No. 102A Jalan Brp 5/3, Bukit Rahman Putra",
      street2: "Sungai Buloh",
      postcode: "47000",
      country: "Malaysia",
      state: "Selangor",
      city: "Kuala Lumpur"
    },
    contactDetails: {
      mobile: "+60378771724",
      whatsapp: "+60378771724",
      other: ""
    }
  },
  // PATIENTS
  // Kaiya Sew Yu (QPTUMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QPTUMMC",
      password: commonPassword,
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
  // Kay Yang Yu (QPT2UMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QPT2UMMC",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Kay",
      middleName: "Yang",
      lastName: "Yu",
      email: "Kay2011@hotmail.com",
      DOB: new Date(1992, 12, 23),
      gender: "Other",
      maritalStatus: "Single",
      passport: "QPT2UMMC"
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
  // Jamilla Tranny Yu (QPT3UMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QPT3UMMC",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Jamila",
      middleName: "Trany",
      lastName: "Yu",
      email: "jamilla2011@hotmail.com",
      DOB: new Date(2008, 12, 23),
      gender: "Female",
      maritalStatus: "Single",
      passport: "QPT3UMMC"
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
  // Tranny Yu (QPT4UMMMC)
  {
    loginDetails: {
      org: "Univeristy of Malaya Medical Center - UMMC",
      ID: "QPT4UMMC",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Tranny",
      middleName: "",
      lastName: "Yu",
      email: "tranpolo2011@hotmail.com",
      DOB: new Date(2008, 12, 23),
      gender: "Female",
      maritalStatus: "Single",
      passport: "QPT4UMMC"
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
  // Shellby Zachery Rollins (QDOCPPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QDOCPPUM",
      password: commonPassword,
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
  // Jaffery Harrison (QDOC2PPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QDOC2PPUM",
      password: commonPassword,
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
      passport: "QDOC2PPUM"
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
  // Raymond Harrison (QDOCPPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QDOC3PPUM",
      password: commonPassword,
      TYPE: "doctor"
    },
    personalDetails: {
      firstName: "Rayamond",
      middleName: "Harrison",
      lastName: "Rollins",
      email: "ray200120011@gmail.com",
      DOB: new Date(1990, 6, 23),
      gender: "Male",
      maritalStatus: "Married",
      department: "Medicine",
      passport: "QDOC3PPUM"
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
  // Jacob Zachery (QPTPPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QPTPPUM",
      password: commonPassword,
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
  },
  // Rinki Saviour (QPT2PPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QPT2PPUM",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Rinki",
      middleName: "Saviour",
      lastName: "Tyler",
      email: "yangopolo200120011@gmail.com",
      DOB: new Date(1999, 6, 23),
      gender: "Other",
      maritalStatus: "Single",
      passport: "QPT2PPUM"
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
  // Jacklin Tyler (QPT3PPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QPT3PPUM",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Jacklin",
      middleName: "",
      lastName: "Tyler",
      email: "jacklin200120011@gmail.com",
      DOB: new Date(1999, 6, 23),
      gender: "Other",
      maritalStatus: "Single",
      passport: "QPT3PPUM"
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
  // Queen Tyler (QPT4PPUM)
  {
    loginDetails: {
      org: "Perpeskuatuan - PPUM",
      ID: "QPT4PPUM",
      password: commonPassword,
      TYPE: "patient"
    },
    personalDetails: {
      firstName: "Queen",
      middleName: "",
      lastName: "Tyler",
      email: "qt200120011@gmail.com",
      DOB: new Date(1999, 6, 23),
      gender: "Female",
      maritalStatus: "Single",
      passport: "QPT4PPUM"
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
let token = null;
axios.interceptors.request.use((config) => {
  config.headers.Authorization = token;
  config.headers.Accept = "application/json";
  return config;
});

async function postRequests() {
  for (const payloadData of payloads) {
    await axios.post("/entity/addNewPatient/onBehalf", {
      payloadData,
      onBehalf
    });
  }
}

async function loginSetAuthorization(LOGINUSER, PASSWORD, TYPE) {
  const user = await axios.post("/entity/login", {
    userID: LOGINUSER,
    password: PASSWORD,
    type: TYPE
  });
  const { session } = user.data;
  token = session?.accessToken;
}

function checkInPatients(patientID, timeStamp) {
  return axios.post("/entity/checkInPatient", { patientID, timeStamp });
}

function checkOutPatient(patientID, timeStamp) {
  return axios.post("/entity/checkOutPatient", { patientID, timeStamp });
}

function assignPatients(patientID, doctorID) {
  return axios.post("/entity/assignPatient", {
    patientID,
    doctorID
  });
}

function dischargePTForDoctor(PTID, DOCID) {
  return axios.post("/doctor/dischargePTForDoctor", {
    PTID,
    DOCID,
    NOTE: "DONE"
  });
}

async function FinalPPUM(t, noDischarge = true) {
  console.log("Logging in as Admin - 1");
  await loginSetAuthorization(org2AdminID, commonPassword, "admin");
  console.log("CheckIn Patient : QPTPPUM");
  await checkInPatients("QPTPPUM", new Date().getTime());
  console.log("CheckIn Patient : QPT2PPUM");
  await checkInPatients(
    "QPT2PPUM",
    new Date(new Date().getTime() - t * 60 * 60 * 1000).getTime()
  );
  console.log("CheckIn Patient : QPT3PPUM");
  await checkInPatients(
    "QPT3PPUM",
    new Date(new Date().getTime() - (t - 2) * 60 * 60 * 1000).getTime()
  );
  console.log("CheckIn Patient : QPT4PPUM");
  await checkInPatients(
    "QPT4PPUM",
    new Date(new Date().getTime() - (t - 3) * 60 * 60 * 1000).getTime()
  );
  console.log("Assign Patient : QPTPPUM to Doctor : QDOCPPUM");
  await assignPatients("QPTPPUM", "QDOCPPUM");
  console.log("Assign Patient : QPTPPUM to Doctor : QDOC2PPUM");
  await assignPatients("QPTPPUM", "QDOC2PPUM");
  console.log("Assign Patient : QPT3PPUM to Doctor : QDOCPPUM");
  await assignPatients("QPT3PPUM", "QDOCPPUM");
  console.log("Assign Patient : QPT3PPUM to Doctor : QDOC2PPUM");
  await assignPatients("QPT3PPUM", "QDOC2PPUM");
  console.log("Assign Patient : QPT3PPUM to Doctor : QDOC3PPUM");
  await assignPatients("QPT3PPUM", "QDOC3PPUM");
  console.log("Assign Patient : QPT4PPUM to Doctor : QDOC3PPUM");
  await assignPatients("QPT4PPUM", "QDOC3PPUM");
  if (noDischarge) {
    console.log("Assign Patient : QPT2PPUM to Doctor : QDOCPPUM");
    await assignPatients("QPT2PPUM", "QDOCPPUM");
    console.log("Assign Patient : QPT2PPUM to Doctor : QDOC3PPUM");
    await assignPatients("QPT2PPUM", "QDOC3PPUM");
  }
  console.log("Login as Doctor : QDOCPPUM");
  await loginSetAuthorization("QDOCPPUM", commonPassword, "doctor");
  console.log("Discharge Patient : QPTPPUM from Doctor : QDOCPPUM");
  await dischargePTForDoctor("QPTPPUM", "QDOCPPUM");
  if (noDischarge) {
    console.log("Discharge Patient : QPT2PPUM from Doctor : QDOCPPUM");
    await dischargePTForDoctor("QPT2PPUM", "QDOCPPUM");
    console.log("Discharge Patient : QPT3PPUM from Doctor : QDOCPPUM");
    await dischargePTForDoctor("QPT3PPUM", "QDOCPPUM");
  }
  console.log("Login as Doctor : QDOC2PPUM");
  await loginSetAuthorization("QDOC2PPUM", commonPassword, "doctor");
  console.log("Discharge Patient : QPTPPUM from Doctor : QDOC2PPUM");
  await dischargePTForDoctor("QPTPPUM", "QDOC2PPUM");
  console.log("Discharge Patient : QPT3PPUM from Doctor : QDOC2PPUM");
  await dischargePTForDoctor("QPT3PPUM", "QDOC2PPUM");
  console.log("Login as Doctor : QDOC3PPUM");
  await loginSetAuthorization("QDOC3PPUM", commonPassword, "doctor");
  console.log("Discharge Patient : QPT4PPUM from Doctor : QDOC3PPUM");
  await dischargePTForDoctor("QPT4PPUM", "QDOC3PPUM");
  if (noDischarge) {
    console.log("Discharge Patient : QPT2PPUM from Doctor : QDOC3PPUM");
    await dischargePTForDoctor("QPT2PPUM", "QDOC3PPUM");
    console.log("Discharge Patient : QPT3PPUM from Doctor : QDOC3PPUM");
    await dischargePTForDoctor("QPT3PPUM", "QDOC3PPUM");
  }

  console.log("Logging in as Admin - 2");
  await loginSetAuthorization(org2AdminID, commonPassword, "admin");
  console.log("CheckOut Patient QPTPPUM");
  await checkOutPatient("QPTPPUM", new Date().getTime());
  console.log("CheckOut Patient QPT4PPUM");
  await checkOutPatient("QPT4PPUM", new Date().getTime());
  if (noDischarge) {
    console.log("CheckOut Patient QPT2PPUM");
    await checkOutPatient(
      "QPT2PPUM",
      new Date(new Date().getTime() - (t + 0.2) * 60 * 60 * 1000).getTime()
    );
    console.log("CheckOut Patient QPT3PPUM");
    await checkOutPatient(
      "QPT3PPUM",
      new Date(new Date().getTime() - (t + 0.4) * 60 * 60 * 1000).getTime()
    );
  }
}

async function FinalUMMC(t, noDischarge = true) {
  console.log("Logging in as Admin - 1");
  await loginSetAuthorization(org1AdminID, commonPassword, "admin");
  console.log("CheckIn Patient : QPTUMMC");
  await checkInPatients("QPTUMMC", new Date().getTime());
  console.log("CheckIn Patient : QPT2UMMC");
  await checkInPatients(
    "QPT2UMMC",
    new Date(new Date().getTime() - t * 60 * 60 * 1000).getTime()
  );
  console.log("CheckIn Patient : QPT3UMMC");
  await checkInPatients(
    "QPT3UMMC",
    new Date(new Date().getTime() - (t - 2) * 60 * 60 * 1000).getTime()
  );
  console.log("CheckIn Patient : QPT4UMMC");
  await checkInPatients(
    "QPT4UMMC",
    new Date(new Date().getTime() - (t - 3) * 60 * 60 * 1000).getTime()
  );
  console.log("Assign Patient : QPTUMMC to Doctor : QDOCUMMC");
  await assignPatients("QPTUMMC", "QDOCUMMC");
  console.log("Assign Patient : QPTUMMC to Doctor : QDOC2UMMC");
  await assignPatients("QPTUMMC", "QDOC2UMMC");
  if (noDischarge) {
    console.log("Assign Patient : QPT2UMMC to Doctor : QDOCUMMC");
    await assignPatients("QPT2UMMC", "QDOCUMMC");
    console.log("Assign Patient : QPT2UMMC to Doctor : QDOC3UMMC");
    await assignPatients("QPT2UMMC", "QDOC3UMMC");
  }
  console.log("Assign Patient : QPT3UMMC to Doctor : QDOCUMMC");
  await assignPatients("QPT3UMMC", "QDOCUMMC");
  console.log("Assign Patient : QPT3UMMC to Doctor : QDOC2UMMC");
  await assignPatients("QPT3UMMC", "QDOC2UMMC");
  console.log("Assign Patient : QPT3UMMC to Doctor : QDOC3UMMC");
  await assignPatients("QPT3UMMC", "QDOC3UMMC");
  console.log("Assign Patient : QPT4UMMC to Doctor : QDOC3UMMC");
  await assignPatients("QPT4UMMC", "QDOC3UMMC");
  console.log("Login as Doctor : QDOCUMMC");
  await loginSetAuthorization("QDOCUMMC", commonPassword, "doctor");
  console.log("Discharge Patient : QPTUMMC from Doctor : QDOCUMMC");
  await dischargePTForDoctor("QPTUMMC", "QDOCUMMC");
  if (noDischarge) {
    console.log("Discharge Patient : QPT2UMMC from Doctor : QDOCUMMC");
    await dischargePTForDoctor("QPT2UMMC", "QDOCUMMC");
    console.log("Discharge Patient : QPT3UMMC from Doctor : QDOCUMMC");
    await dischargePTForDoctor("QPT3UMMC", "QDOCUMMC");
  }
  console.log("Logging in as QDOC2UMMC");
  await loginSetAuthorization("QDOC2UMMC", commonPassword, "doctor");
  console.log("Discharge Patient : QPTUMMC from Doctor : QDOC2UMMC");
  await dischargePTForDoctor("QPTUMMC", "QDOC2UMMC");
  await dischargePTForDoctor("QPT3UMMC", "QDOC2UMMC");
  console.log("Logging in as QDOC3UMMC");
  await loginSetAuthorization("QDOC3UMMC", commonPassword, "doctor");
  await dischargePTForDoctor("QPT4UMMC", "QDOC3UMMC");
  if (noDischarge) {
    console.log("Discharge Patient : QPT2UMMC from Doctor : QDOC3UMMC");
    await dischargePTForDoctor("QPT2UMMC", "QDOC3UMMC");
    console.log("Discharge Patient : QPT3UMMC from Doctor : QDOC3UMMC");
    await dischargePTForDoctor("QPT3UMMC", "QDOC3UMMC");
  }
  console.log("Logging in as Admin - 2");
  await loginSetAuthorization(org1AdminID, commonPassword, "admin");
  console.log("CheckOut Patient QPTUMMC");
  await checkOutPatient("QPTUMMC", new Date().getTime());
  if (noDischarge) {
    console.log("CheckOut Patient QPT2UMMC");
    await checkOutPatient(
      "QPT2UMMC",
      new Date(new Date().getTime() - (t + 0.2) * 60 * 60 * 1000).getTime()
    );
    console.log("CheckOut Patient QPT3UMMC");
    await checkOutPatient(
      "QPT3UMMC",
      new Date(new Date().getTime() - (t + 0.4) * 60 * 60 * 1000).getTime()
    );
    await checkOutPatient(
      "QPT4UMMC",
      new Date(new Date().getTime() - (t + 0.5) * 60 * 60 * 1000).getTime()
    );
  }
}

async function runTestingScripts() {
  console.log("Running FINAL UMMC - 4 HOURS");
  await FinalUMMC(4);
  console.log("Running FINAL PPUM - 4 HOURS");
  await FinalPPUM(4);
  // await FinalUMMC(14);
  // await FinalPPUM(14);
  // await FinalUMMC(24);
  // await FinalPPUM(24);
  console.log("Running FINAL UMMC - 36 HOURS");
  await FinalUMMC(36, false, false);
  console.log("Running FINAL PPUM - 36 HOURS");
  await FinalPPUM(36, false, false);
}
(async function Final() {
  try {
    await postRequests();
    setTimeout(runTestingScripts, 3000);
  } catch (e) {
    console.log(e);
  }
})();
