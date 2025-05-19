import React, { useEffect, useState } from "react";
import {
  createAdmin,
  getAllUsers,
  getCourses,
  getRoles,
} from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import CommonTable from "../Common/CommonTable";
import { Row, Col, Input, Spin, Upload, Drawer, Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import PortalInputField from "../Common/PortalInputField";
import {
  addressValidator,
  emailValidator,
  nameValidator,
  selectValidator,
} from "../Common/Validation";
import "./styles.css";
import PortalSelectField from "../Common/PortalSelectField";
import { createAction } from "@reduxjs/toolkit";
import { LoadingOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function Users() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [role, setRole] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [courseIdError, setCourseIdError] = useState(null);
  const [experienceOptions, setExperienceOptions] = useState([
    { id: "1 year", name: "1 year" },
    { id: "2 year", name: "2 year" },
    { id: "3 year", name: "3 year" },
    { id: "3 year", name: "3 year" },
    { id: "4 year", name: "4 year" },
    { id: "5+", name: "5+" },
  ]);
  const [experience, setExperience] = useState(null);
  const [experienceError, setExperienceError] = useState("");
  const [roleError, setRoleError] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const columns = [
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Email", key: "email", dataIndex: "email" },
    { title: "Role", key: "role", dataIndex: "role" },
  ];
  const [profilePictureArray, setProfilePictureArray] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    getRolesdata();
  }, []);

  const getRolesdata = async () => {
    try {
      const response = await getRoles();
      console.log("role response", response);
      const roles = response?.data?.data || [];
      if (roles.length >= 1) {
        const filterExceptStudents = roles.filter((f) => f.id != 3);
        setRoleOptions(filterExceptStudents);
      } else {
        setRoleOptions([]);
      }
    } catch (error) {
      setRoleOptions([]);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        getCourseData();
      }, 200);
    }
  };

  const getCourseData = async () => {
    try {
      const response = await getCourses();
      const allCourses = response?.data?.data || [];
      if (allCourses.length >= 1) {
        setCourseOptions(allCourses);
      } else {
        setCourseOptions([]);
      }
    } catch (error) {
      setCourseOptions([]);
    } finally {
      setTimeout(() => {
        getUsersData();
      }, 300);
    }
  };

  const getUsersData = async () => {
    setTableLoading(true);
    try {
      const response = await getAllUsers();
      console.log("users response", response);
      const allUsers = response?.data?.data || [];
      if (allUsers.length >= 1) {
        const filterExceptStudents = allUsers.filter(
          (f) => f.role === "Admin" || f.role === "Trainer"
        );
        console.log("except students", filterExceptStudents);
        setUsersData(filterExceptStudents);
      } else {
        setUsersData([]);
      }
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        setTableLoading(false);
      }, 500);
    }
  };

  const handleProfileAttachment = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const isValidType =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";

    if (isValidType) {
      console.log("fileeeee", file);
      setProfileName(file?.name || "");
      CommonToaster("Profile uploaded");
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Extract Base64 content
        setProfilePicture(base64String); // Store in state
      };
    } else {
      CommonToaster("Accept only .png, .jpg and .jpeg");
      setProfilePicture("");
      setProfileName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
    const passwordValidate = addressValidator(password);
    const roleValidate = selectValidator(role);
    let isFormError = false;

    setNameError(nameValidate);
    setEmailError(emailValidate);
    setPasswordError(passwordValidate);
    setRoleError(roleValidate);

    if (role === 2) {
      const experienceValidate = selectValidator(experience);
      const courseValidate = selectValidator(courseId);

      setExperienceError(experienceValidate);
      setCourseIdError(courseValidate);

      if (experienceValidate || courseValidate) {
        isFormError = true;
      } else {
        isFormError = false;
      }
    }

    if (
      nameValidate ||
      emailValidate ||
      passwordValidate ||
      roleValidate ||
      isFormError
    )
      return;

    setButtonLoading(true);
    const payload = {
      name: name,
      email: email,
      password: password,
      role_id: role,
      course_id: courseId,
      experience: experience,
      profile: profilePicture,
      course_join_date: null,
      location_id: null,
    };

    try {
      await createAdmin(payload);
      CommonToaster("User created");
      setTimeout(() => {
        formReset();
        getUsersData();
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setButtonLoading(false);
      }, 500);
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    }
  };

  const formReset = () => {
    setOpen(false);
    setButtonLoading(false);
    setName("");
    setNameError("");
    setEmail("");
    setEmailError("");
    setPassword("");
    setPasswordError("");
    setRole(null);
    setRoleError("");
    setValidationTrigger(false);
    setExperience("");
    setExperienceError("");
    setProfilePicture("");
    setProfilePictureArray([]);
    setProfileName("");
    setCourseId(null);
    setCourseIdError("");
  };

  return (
    <div>
      <p className="portal_mainheadings">Users</p>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="questionupload_filterContainer">
            <Search
              placeholder="Search by email"
              enterButton
              style={{ width: "42%" }}
            />
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <button
            className="questionupload_button"
            onClick={() => setOpen(true)}
          >
            <IoMdAdd size={19} style={{ marginRight: "6px" }} /> Add User
          </button>
        </Col>
      </Row>

      <div style={{ marginTop: "22px" }}>
        <CommonTable
          scroll={{ x: 600 }}
          columns={columns}
          dataSource={usersData}
          dataPerPage={10}
          loading={tableLoading}
          checkBox="false"
          size="small"
          className="questionupload_table"
        />
      </div>

      <Drawer
        title="Add User"
        open={open}
        // onOk={handleLogout}
        onClose={formReset}
        width="35%"
        footer={false}
      >
        <form>
          <div>
            <PortalInputField
              label="Name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (validationTrigger) {
                  setNameError(nameValidator(event.target.value));
                }
              }}
              error={nameError}
            />
          </div>
          <div style={{ marginTop: "22px" }}>
            <PortalInputField
              label="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (validationTrigger) {
                  setEmailError(emailValidator(event.target.value));
                }
              }}
              error={emailError}
            />
          </div>

          <div style={{ marginTop: "22px", position: "relative" }}>
            <p className="userpassword_label">Password</p>
            <Input.Password
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (validationTrigger) {
                  setPasswordError(addressValidator(event.target.value));
                }
              }}
              className={
                passwordError ? "userpasswordfield_error" : "userpasswordfield"
              }
            />
            <p
              className={
                passwordError
                  ? "user_passworderror_visible"
                  : "user_passworderror_hide"
              }
            >
              {passwordError ? "Password" + passwordError : ""}
            </p>
          </div>

          <div style={{ marginTop: "22px" }}>
            <PortalSelectField
              label="Role"
              value={role}
              options={roleOptions}
              onChange={(value) => {
                setRole(value);
                if (validationTrigger) {
                  setRoleError(selectValidator(value));
                }
              }}
              error={roleError}
            />
          </div>

          {role === 2 && (
            <>
              <div style={{ marginTop: "22px" }}>
                <PortalSelectField
                  label="Course"
                  value={courseId}
                  options={courseOptions}
                  onChange={(value) => {
                    setCourseId(value);
                    if (validationTrigger) {
                      setCourseIdError(selectValidator(value));
                    }
                  }}
                  error={courseIdError}
                />
              </div>

              <div style={{ marginTop: "22px" }}>
                <PortalSelectField
                  label="Experience"
                  value={experience}
                  options={experienceOptions}
                  onChange={(value) => {
                    setExperience(value);
                    if (validationTrigger) {
                      setExperienceError(selectValidator(value));
                    }
                  }}
                  error={experienceError}
                />
              </div>

              <div
                style={{
                  marginTop: "26px",
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <p className="userpassword_label">Upload profile</p>
                <input
                  type="file"
                  style={{ width: "70%" }}
                  onChange={handleProfileAttachment}
                />
              </div>
            </>
          )}

          <div className="user_formbuttonContainer">
            {buttonLoading ? (
              <button
                className="user_disableformsubmitbutton"
                onClick={handleSubmit}
              >
                <>
                  <Spin
                    size="small"
                    indicator={
                      <LoadingOutlined
                        style={{ color: "#ffffff", marginRight: "6px" }}
                        spin
                      />
                    }
                  />{" "}
                </>
              </button>
            ) : (
              <button className="user_formsubmitbutton" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </form>
      </Drawer>
    </div>
  );
}
