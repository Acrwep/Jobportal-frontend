import React, { useEffect, useState } from "react";
import { createAdmin, getAllUsers, getRoles } from "../Common/action";
import { CommonToaster } from "../Common/CommonToaster";
import CommonTable from "../Common/CommonTable";
import { Row, Col, Input, Spin, Modal } from "antd";
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

  useEffect(() => {
    getRolesdata();
  }, []);

  const getRolesdata = async () => {
    try {
      const response = await getRoles();
      console.log("role response", response);
      const roles = response?.data?.data || [];
      setRoleOptions(roles);
    } catch (error) {
      CommonToaster(
        error?.response?.data?.message ||
          "Something went wrong. Try again later"
      );
    } finally {
      setTimeout(() => {
        getUsersData();
      }, 500);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationTrigger(true);

    const nameValidate = nameValidator(name);
    const emailValidate = emailValidator(email);
    const passwordValidate = addressValidator(password);
    const roleValidate = selectValidator(role);

    setNameError(nameValidate);
    setEmailError(emailValidate);
    setPasswordError(passwordValidate);
    setRoleError(roleValidate);

    if (nameValidate || emailValidate || passwordValidate || roleValidate)
      return;

    setButtonLoading(true);
    const payload = {
      name: name,
      email: email,
      password: password,
      role_id: role,
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
            <IoMdAdd size={19} style={{ marginRight: "4px" }} />
            Add User
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

      <Modal
        title="Add User"
        open={open}
        // onOk={handleLogout}
        onCancel={formReset}
        width="36%"
        footer={false}
      >
        <form>
          <div style={{ marginTop: "22px" }}>
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
      </Modal>
    </div>
  );
}
