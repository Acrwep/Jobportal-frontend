import React, { useEffect, useState } from "react";
import {
  createAdmin,
  getAllUsers,
  getCourses,
  getRoles,
  updateUser,
} from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import CommonTable from "../Common/CommonTable";
import { Row, Col, Input, Spin, Upload, Drawer, Modal } from "antd";
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
import { AiTwotoneEdit } from "react-icons/ai";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function Users() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [role, setRole] = useState(2);
  const experienceOptions = [
    { id: "1 year", name: "1 year" },
    { id: "2 year", name: "2 year" },
    { id: "3 year", name: "3 year" },
    { id: "4 year", name: "4 year" },
    { id: "5+", name: "5+" },
  ];
  const [experience, setExperience] = useState(null);
  const [experienceError, setExperienceError] = useState("");
  const [roleError, setRoleError] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [profilePictureArray, setProfilePictureArray] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const columns = [
    { title: "Name", key: "name", dataIndex: "name", width: 240 },
    { title: "Email", key: "email", dataIndex: "email", width: 280 },
    { title: "Password", key: "password", dataIndex: "password" },
    { title: "Role", key: "role", dataIndex: "role", width: 180 },
    {
      title: "Edit",
      key: "action",
      dataIndex: "action",
      width: 180,
      render: (item, record) => {
        return (
          <div
            className="questionupload_table_actionContainer"
            style={{ marginLeft: "12px" }}
          >
            <div>
              <AiTwotoneEdit
                size={20}
                onClick={() => handleEdit(record)}
                className="questionupload_actionicons"
              />
            </div>
          </div>
        );
      },
    },
  ];

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
        getUsersData();
      }, 200);
    }
  };

  const getUsersData = async (search) => {
    setTableLoading(true);
    const payload = {
      name: search ? search : null,
    };
    try {
      const response = await getAllUsers(payload);
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

  const handleProfileAttachment = ({ fileList: newFileList }) => {
    console.log("newww", newFileList);
    if (newFileList.length <= 0) {
      setProfilePicture("");
      setProfilePictureArray([]);
      return;
    }
    const isValidType =
      newFileList[0].type === "image/png" ||
      newFileList[0].type === "image/jpeg" ||
      newFileList[0].type === "image/jpg";

    if (isValidType) {
      console.log("fileeeee", newFileList);
      setProfilePictureArray(newFileList);
      CommonToaster("Profile uploaded");
    } else {
      CommonToaster("Accept only .png, .jpg and .jpeg");
      setProfilePicture("");
      setProfilePictureArray([]);
    }
  };

  const handlePreview = async (file) => {
    if (file.url) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      return;
    }
    const rawFile = file.originFileObj || file;

    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = () => {
      const dataUrl = reader.result; // Full base64 data URL like "data:image/jpeg;base64,..."
      console.log("urlllll", dataUrl);
      setPreviewImage(dataUrl); // Show in Modal
      setProfilePicture(dataUrl.split(",")[1]); // Store Base64 content only
      setPreviewOpen(true);
    };
  };

  const handleRemoveProfile = (fileToRemove) => {
    const newFileList = profilePictureArray.filter(
      (file) => file.uid !== fileToRemove.uid
    );
    setProfilePictureArray(newFileList);
    setProfilePicture(""); // clear base64
    CommonToaster("Profile removed");
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

      setExperienceError(experienceValidate);

      if (experienceValidate) {
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
      ...(isEdit && { id: userId }),
      name: name,
      email: email,
      password: password,
      role_id: role,
      course_id: null,
      experience: experience,
      profile: profilePicture,
      course_join_date: null,
      location_id: null,
    };

    if (isEdit) {
      try {
        await updateUser(payload);
        CommonToaster("User updated");
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
    } else {
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
    }
  };

  const formReset = () => {
    setOpen(false);
    setButtonLoading(false);
    setIsEdit(false);
    setUserId(null);
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
  };

  const handleSearch = (e) => {
    console.log("search", e.target.value);
    getUsersData(e.target.value);
  };
  const handleEdit = (item) => {
    console.log("clicked user", item);
    setIsEdit(true);
    setUserId(item.id);
    const base64String = item.profile;
    const fileObject = {
      uid: "-1", // any unique id
      name: "profile.png",
      status: "done",
      url: `data:image/png;base64,${base64String}`, // Full Data URL
    };
    setProfilePictureArray([fileObject]);
    setProfilePicture(base64String);
    setPreviewImage(`data:image/png;base64,${base64String}`);
    setName(item.name);
    setEmail(item.email);
    setPassword(item.password);
    setRole(item.role === "Trainer" ? 2 : 1);
    setExperience(item.experience);
    setOpen(true);
  };

  return (
    <div>
      <p className="portal_mainheadings">Users</p>

      <Row style={{ marginTop: "22px" }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className="questionupload_filterContainer">
            <Search
              placeholder="Search by name"
              enterButton
              style={{ width: "42%" }}
              allowClear
              onChange={handleSearch}
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
          {role === 2 && (
            <div className="user_trainerprofileContainer">
              <Upload
                listType="picture-circle"
                fileList={profilePictureArray}
                onPreview={handlePreview}
                onChange={handleProfileAttachment}
                onRemove={(file) => handleRemoveProfile(file)}
                beforeUpload={() => false} // prevent auto upload
              >
                {profilePictureArray.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          )}
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
      <Modal
        open={previewOpen}
        title="Preview Profile"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}
