import { useState, useRef, useEffect } from "react";
import db from "./firebase/db";
import {Link} from 'react-router-dom'



export default function ModifyPerson({ id }) {
  const [inputFields, setInputFields] = useState({
    city: "",
    first_name: "",
    gender: "",
    last_name: "" 
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    city: "",
    gender: "",
  });

  useEffect(()=>{
    const personRef = db.collection("persons").doc(id);
    personRef
      .get()
      .then((doc) => {
        if (doc.exists) {
      setInputFields(doc.data())
          console.log("Document data:", doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [])
  

  const [formWasValidated, setFormWasValidated] = useState(false);

  const [formAlertText, setFormAlertText] = useState("");
  const [formAlertType, setFormAlertType] = useState("");

  const references = {
    first_name: useRef(),
    last_name: useRef(),
    city: useRef(),
    gender: useRef(),
  };

  const validators = {
    gender: {
      required: isNotEmpty,
      lessThan20: isLessThan20,
    },
    first_name: {
      required: isNotEmpty,
    },
    last_name: {
      required: isNotEmpty,
    },
    city: {
      required: isNotEmpty,
    },
  };

  function isLessThan20(value) {
    return value.length <= 20;
  }

  function isNotEmpty(value) {
    return value !== "";
  }

  const errorTypes = {
    required: "Hiányzó érték",
    lessThan20: "A mező hosszabb, mint 10",
  };

  function isFormValid() {
    let isFormValid = true;
    for (const fieldName of Object.keys(inputFields)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setFormAlertText("");
    setFormAlertType("");
    setFormWasValidated(false);

    const isValid = isFormValid();

    let personToUpdate = db.collection("persons").doc(id);

    if (isValid) {
      if (!(await isPersonExist(inputFields.first_name))) {
        personToUpdate
          .update({
            ...inputFields,
          })
          .then((docRef) => {
            setFormAlertText(`Sikeres mentés`);
            setFormAlertType("success");
            setInputFields({
              first_name: "",
              last_name: "",
              city: "",
              gender: "",
            });
          });
      } else {
        setFormAlertText(`A "${inputFields.first_name}" név már létezik`);
        setFormAlertType("danger");
      }
    } else{
        setFormWasValidated(true);
    }
    
  }

  async function isPersonExist(first_name) {
    const snapshot = await db
      .collection("persons")
      .where("first_name", "==", first_name)
      .get();
    return snapshot.docs.length !== 0;
  }

 
  
  function handleInputChange(e) {
    const value = e.target.value;
    const fieldName = e.target.name;
    setInputFields({
      ...inputFields,
      [fieldName]: value,
    });
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: "",
    }));
  }
  

  function validateField(fieldName) {
    const value = inputFields[fieldName];
    let isValid = true;
    setErrors((previousErrors) => ({
      ...previousErrors,
      [fieldName]: "",
    }));

    references[fieldName].current.setCustomValidity("");

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid !== false) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = errorTypes[validationType];
         
            setErrors((previousErrors) => {
              return {
                ...previousErrors,
                [fieldName]: errorText,
              };
            });
            references[fieldName].current.setCustomValidity(errorText);
            console.log(references[fieldName]);
          }
        }
      }
    }
    return isValid;
  }

  function handleInputBlur(e) {
    const name = e.target.name;

    validateField(name);
  }

  return (
    <main className="container">
      <h1>Szerkesztés</h1>
      <form
        onSubmit={handleSubmit}
        noValidate={true}
        className={`needs-validation ${
          formWasValidated ? "was-validated" : ""
        }`}
      >
        <PersonInput
          reference={references["first_name"]}
          name="first_name"
          labelText="Firstname"
          type="text"
          errors={errors}
          inputFields={inputFields}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <PersonInput
          reference={references["last_name"]}
          name="last_name"
          labelText="Lastname"
          type="text"
          errors={errors}
          inputFields={inputFields}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <PersonInput
          reference={references["city"]}
          name="city"
          labelText="City"
          type="text"
          errors={errors}
          inputFields={inputFields}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <PersonInput
          reference={references["gender"]}
          name="gender"
          labelText="Gender"
          type="text"
          errors={errors}
          inputFields={inputFields}
          handleInputBlur={handleInputBlur}
          handleInputChange={handleInputChange}
          required={true}
        />
        <button type="submit" className="btn btn-primary mb-3">
          Mentés
        </button>
      </form>
      {formAlertText && (
        <div className={`alert mt-3 alert-${formAlertType}`} role="alert">
          {formAlertText}
        </div>
      )}
      <Link className="backToHome" to="/">
        back to home
      </Link>
    </main>
  );
}

function PersonInput({
  errors,
  inputFields,
  handleInputChange,
  handleInputBlur,
  type,
  name,
  labelText,
  required,
  reference,
}) {
  return (
    <div className={`mb-3 ${errors[name] !== "" ? "was-validated" : ""}`}>
      <label className="form-label">{labelText}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={inputFields[name]}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        required={required}
        ref={reference}
      />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );
}
