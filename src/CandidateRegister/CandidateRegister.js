import React, { useState } from "react";
import "./styles.css";
import CommonInputField from "../Common/CommonInputField";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import CommonSelectField from "../Common/CommonSelectField";
import { Row, Col, Button, Checkbox } from "antd";
import CommonDatePicker from "../Common/CommonDatePicker";
import { AiOutlineDelete } from "react-icons/ai";

export default function CandidateRegister() {
  const [pageSection, setPageSection] = useState(1);
  const experienceYearsOptions = [
    { id: 1, name: "0 years" },
    { id: 2, name: "1 years" },
    { id: 3, name: "2 years" },
    { id: 4, name: "3 years" },
    { id: 5, name: "4 years" },
    { id: 6, name: "5 years" },
    { id: 7, name: "6 years" },
    { id: 8, name: "7 years" },
    { id: 9, name: "8 years" },
    { id: 10, name: "9 years" },
    { id: 11, name: "10 years" },
    { id: 13, name: "12 years" },
    { id: 14, name: "13 years" },
    { id: 15, name: "14 years" },
    { id: 16, name: "15 years" },
    { id: 17, name: "16 years" },
  ];
  const experienceMonthsOptions = [
    { id: 1, name: "0 months" },
    { id: 2, name: "1 months" },
    { id: 3, name: "2 months" },
    { id: 4, name: "3 months" },
    { id: 5, name: "4 months" },
    { id: 6, name: "5 months" },
    { id: 7, name: "6 months" },
    { id: 8, name: "7 months" },
    { id: 9, name: "8 months" },
    { id: 10, name: "9 months" },
    { id: 11, name: "10 months" },
    { id: 12, name: "11 months" },
    { id: 13, name: "12 months" },
  ];

  const locationOptions = [
    { id: 1, name: "Hyderabad / Secunderabad, Telangana" },
    { id: 2, name: "Bengaluru / Bangalore" },
    { id: 3, name: "Pune" },
    { id: 4, name: "Chennai" },
  ];

  const [companyDetails, setCompanyDetails] = useState([
    {
      id: Date.now(),
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
  ]);

  const skillsOptions = [
    { id: 1, name: "HTML" },
    { id: 2, name: "CSS" },
  ];

  const [skills, setSkills] = useState([]);

  const noticePeriodOptions = [
    { id: 1, name: "Serving notice period" },
    { id: 2, name: "Immediately available" },
    { id: 3, name: "15 Days" },
    { id: 4, name: "30 Days" },
    { id: 5, name: "45 Days" },
    { id: 6, name: "2 Months" },
    { id: 7, name: "3 Months" },
    { id: 8, name: "6 Months" },
  ];
  // Function to add a new set of company fields
  const addCompanyField = () => {
    let object = {
      id: Date.now(),
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    };
    setCompanyDetails([...companyDetails, object]);
  };

  // Handle change in input fields
  const handleChange = (index, field, value) => {
    const updatedDetails = [...companyDetails];

    // Update the value
    updatedDetails[index][field] = value;

    // Validation: Check if company name length is less than 3
    if (field === "companyName") {
      updatedDetails[index].error =
        value.length < 3 ? "Company name must be at least 3 characters" : "";
    }
    if (field === "currentlyWorking") {
      if (updatedDetails[index]["currentlyWorking"] === true) {
        updatedDetails[index].endDate = null;
        updatedDetails[index].disbleStatus = true;
      } else {
        updatedDetails[index].disbleStatus = false;
      }
    }

    setCompanyDetails(updatedDetails);
  };

  const deleteCompanyField = (index) => {
    let data = [...companyDetails];
    data.splice(index, 1);
    setCompanyDetails(data);
  };

  const handleBackward = () => {
    if (pageSection === 1) {
      return;
    } else {
      setPageSection(pageSection - 1);
    }
  };

  const handleForward = () => {
    setPageSection(pageSection + 1);
  };

  const formResult = () => {
    console.log(companyDetails);
  };

  return (
    <div className="candidate_maincontainer">
      <div className="candidate_subcontainer">
        {pageSection === 1 ? (
          <>
            <p className="candidate_fieldheading">Hi, your name is</p>
            <CommonInputField />
          </>
        ) : pageSection === 2 ? (
          <>
            <p className="candidate_experienceheading">
              What’s your total work experience?
            </p>
            <p className="candidate_freshertext">
              If you are student/fresher, choose{" "}
              <span style={{ color: "#0056b3", fontWeight: 600 }}>
                0 year and 0 month
              </span>
            </p>
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <CommonSelectField options={experienceYearsOptions} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <CommonSelectField options={experienceMonthsOptions} />
              </Col>
            </Row>
          </>
        ) : pageSection === 3 ? (
          <>
            <p className="candidate_fieldheading">Where are you now?</p>
            <CommonSelectField options={locationOptions} />
            <p className="candidate_popularlocation">Popular locations</p>
            <div className="candidate_locationsmaindiv">
              {locationOptions.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="candidate_locationdiv">
                      <p>{item.name}</p>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </>
        ) : pageSection === 4 ? (
          <>
            <p className="candidate_fieldheading">Tell us about your company</p>
            <div className="candidate_companydetailsmaindiv">
              {companyDetails.map((company, index) => (
                <React.Fragment key={company.id}>
                  <Row gutter={16} style={{ marginBottom: "22px" }}>
                    <Col xs={24} sm={24} md={12}>
                      <CommonInputField
                        label="Company Name"
                        value={company.companyName}
                        onChange={(e) =>
                          handleChange(index, "companyName", e.target.value)
                        }
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <CommonSelectField
                        label="Designation"
                        options={[]}
                        value={company.designation}
                        onChange={(value) =>
                          handleChange(index, "designation", value)
                        }
                      />
                    </Col>
                  </Row>

                  <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col xs={24} sm={24} md={12}>
                      <CommonDatePicker
                        label="Start Date"
                        value={company.startDate}
                        onChange={(value) =>
                          handleChange(index, "startDate", value)
                        }
                      />
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                      <CommonDatePicker
                        label="End Date"
                        value={company.endDate}
                        onChange={(value) =>
                          handleChange(index, "endDate", value)
                        }
                        disabled={company.disbleStatus}
                      />
                    </Col>
                  </Row>

                  <Row gutter={16} className="candidate_companydeleterowdiv">
                    <Col xs={24} sm={24} md={12}>
                      <Checkbox
                        checked={company.currentlyWorking ?? false} // Ensure it's always a boolean
                        onChange={(e) => {
                          handleChange(
                            index,
                            "currentlyWorking",
                            e.target.checked
                          );
                        }}
                      >
                        Currenly Working
                      </Checkbox>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        onClick={() => deleteCompanyField(index)}
                        className="candidate_companydeletebutton"
                      >
                        <AiOutlineDelete size={19} /> Delete
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              ))}
              {/* Button to Add More Fields */}
              <Button
                onClick={addCompanyField}
                className="candidate_companyaddbutton"
              >
                Add Company
              </Button>
              <button onClick={formResult}>Check</button>
            </div>
          </>
        ) : pageSection === 5 ? (
          <>
            <p className="candidate_fieldheading">Tell us about your skills</p>
            <CommonSelectField
              mode="tags"
              options={skillsOptions}
              onChange={(value) => {
                setSkills(value);
              }}
              placeholder="Enter your skills"
            />
          </>
        ) : pageSection === 6 ? (
          <>
            <p className="candidate_fieldheading">
              What’s your latest annual salary?
            </p>
            <CommonInputField />
          </>
        ) : pageSection === 7 ? (
          <>
            <p className="candidate_fieldheading">
              What’s your notice period like?
            </p>
            <div className="candidate_locationsmaindiv">
              {noticePeriodOptions.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="candidate_locationdiv">
                      <p>{item.name}</p>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </>
        ) : (
          ""
        )}
      </div>

      {/* footer */}
      <div className="candidate_footercontainer">
        <div className="candidate_backwarddiv" onClick={handleBackward}>
          {pageSection === 1 ? (
            ""
          ) : (
            <>
              <IoIosArrowBack
                size={20}
                color="#0056b3"
                style={{ marginTop: "1px" }}
              />
              <p className="candidate_backtext">Back</p>
            </>
          )}
        </div>
        <button className="candidate_forwardbutton" onClick={handleForward}>
          <IoIosArrowForward size={26} color="#ffffff" />
        </button>
      </div>
    </div>
  );
}
