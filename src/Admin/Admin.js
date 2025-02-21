import React, { useEffect, useState } from "react";
import CommonTable from "../Common/CommonTable";
import CommonSearchField from "../Common/CommonSearchbar";
import { CiFilter } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { MdFilterList } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import "./styles.css";
import { Row, Col, Divider } from "antd";
import { getStudents } from "../Common/action";

export default function Admin() {
  const filterList = [
    { id: 1, name: "Experience" },
    { id: 2, name: "Location" },
    { id: 3, name: "Salary" },
    { id: 4, name: "Education" },
    { id: 5, name: "Notice Period" },
    { id: 6, name: "Age" },
    { id: 7, name: "Gender" },
  ];
  const skillsList = [
    { id: 1, name: "HTML" },
    { id: 2, name: "CSS" },
    { id: 3, name: "Reactjs" },
    { id: 4, name: "Node js" },
    { id: 5, name: "Mysql" },
    { id: 6, name: "Java" },
    { id: 7, name: "Python" },
  ];

  const [candidates, setCandidates] = useState([]);
  const columns = [
    { title: "Name", dataIndex: "name", key: "1", width: 190 },
    { title: "Email", dataIndex: "email", key: "2", width: 220 },
    { title: "Mobile", dataIndex: "mobile", key: "3", width: 140 },
    { title: "DOB", dataIndex: "dob", key: "4", width: 140 },
    { title: "Addess", dataIndex: "address", key: "5", width: 220 },
    { title: "Location", dataIndex: "location", key: "6", width: 160 },
    { title: "College Name", dataIndex: "college", key: "7", width: 220 },
    {
      title: "College Department",
      dataIndex: "department",
      key: "8",
      width: 220,
    },
    { title: "Skills", dataIndex: "skills", key: "9", width: 260 },
    { title: "Experience", dataIndex: "experience", key: "10", width: 140 },
    { title: "Designation", dataIndex: "designation", key: "11", width: 220 },
    { title: "Company Name", dataIndex: "companyname", key: "12", width: 220 },
    {
      title: "Working Status",
      dataIndex: "workingstatus",
      key: "13",
      width: 120,
    },
  ];
  const data = [
    { id: 1, name: "Balaji", email: "balaji@gmail.com", mobile: "98786765667" },
    { id: 2, name: "Rahul", email: "rahul@gmail.com", mobile: "98786765667" },
  ];

  useEffect(() => {
    getStudentsData();
  }, []);

  const getStudentsData = async () => {
    try {
      const response = await getStudents();
      console.log("candidates response", response);
      setCandidates(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin_mainContainer">
      {/* <Row style={{ marginBottom: "12px" }}>
        <Col span={12}>
          <p className="admin_header">Students</p>
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="admin_filterContainer">
            <CommonSearchField placeholder="Search by name" />
            <div className="admin_filtericondiv">
              <CiFilter size={21} color="#0056b3" />
            </div>
          </div>
        </Col>
      </Row>
      <CommonTable
        columns={columns}
        dataSource={data}
        scroll={{ x: 2200 }}
        dataPerPage={10}
        bordered="true"
        checkBox="false"
        size="middle"
      /> */}

      <Row gutter={16}>
        <Col span={6}>
          <div className="admin_filtermainContainer">
            <Row
              className="admin_filtersubContainer"
              style={{ paddingTop: "19px" }}
            >
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                xxl={12}
                className="admin_leftheding_coldiv"
              >
                <p className="filters_heading">Filters</p>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                xxl={12}
                className="admin_clearContainer"
              >
                <p style={{ cursor: "pointer" }}>Clear All</p>
              </Col>
            </Row>
            <Divider className="admin_filterdivider" />

            {filterList.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Row className="admin_filtersubContainer">
                    <Col span={12} className="admin_leftheding_coldiv">
                      <p className="filters_heading">{item.name}</p>
                    </Col>
                    <Col span={12} className="admin_clearContainer">
                      <div className="admin_filterbuttonContainer">
                        <div className="admin_filtercloseicondiv">
                          <IoCloseSharp size={18} />
                        </div>
                        <div className="admin_filterarrowicondiv">
                          <IoIosArrowForward size={18} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Divider className="admin_filterdivider" />
                </React.Fragment>
              );
            })}
          </div>
        </Col>
        <Col span={18}>
          <div className="admin_candidatesDetailscard">
            <Row gutter={16} className="admin_candidatesDetailsmainContainer">
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Row>
                  <Col span={6}>
                    <FaRegUser size={55} />
                  </Col>
                  <Col span={18}>
                    <p className="admin_candidatename">Balaji</p>
                    <p className="admin_candidategender">Male</p>
                    <p className="admin_candidategender">Frontend Developer</p>
                    <p className="admin_candidategender">
                      Markerz Global Solution Private Limited
                    </p>
                    <p className="admin_candidategender">Jun 2023 - Present </p>
                  </Col>
                </Row>

                <Row style={{ marginTop: "12px" }}>
                  <Col span={6}>
                    <p className="admin_candidate_locationtext">
                      Job location:
                    </p>
                  </Col>
                  <Col span={18}>
                    <p className="admin_candidate_locationtext">Chennai</p>
                  </Col>
                </Row>

                <Row style={{ marginTop: "16px" }}>
                  <Col span={6}>
                    <p className="admin_candidate_locationtext">
                      Pref. location:
                    </p>
                  </Col>
                  <Col span={18}>
                    <p className="admin_candidate_locationtext">Chennai</p>
                  </Col>
                </Row>

                <Row style={{ marginTop: "16px" }}>
                  <Col span={6}>
                    <p className="admin_candidate_locationtext">Nationality:</p>
                  </Col>
                  <Col span={18}>
                    <p className="admin_candidate_locationtext">India</p>
                  </Col>
                </Row>

                <Row style={{ marginTop: "16px" }}>
                  <Col span={6}>
                    <p className="admin_candidate_locationtext">Education:</p>
                  </Col>
                  <Col span={18}>
                    <p className="admin_candidate_locationtext">
                      Bachelor Of Technology (B.Tech/B.E)(Information
                      Technology) at Dhanalakshmi College of Engineering in 2021
                    </p>
                  </Col>
                </Row>

                <Row style={{ marginTop: "16px" }}>
                  <Col span={6}>
                    <p className="admin_candidate_locationtext">Skills:</p>
                  </Col>
                  <Col span={18}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "0px" }}
                    >
                      {skillsList.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <div className="admin_candidateskills_container">
                              <p>{item.name}</p>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <p className="admin_candidate_profilesummaryheading">
                  Profile Summary
                </p>
                <p className="admin_candidate_profilesummary">
                  Experienced Frontend Developer with 2 years in Markerz Global
                  Solution Private Limited, proficient in CSS, HTML, Javascript,
                  React, Bootstrap, Redux, react Hook, dotnet MAUI and Material
                  UI. Achieved exceptional results in the development of
                  user-friendly interfaces, seeking to transition into a
                  Frontend Developer role.
                </p>
                <Row gutter={16} style={{ marginTop: "20px" }}>
                  <Col span={8}>
                    <p className="admin_experienceheading">Total Experience</p>
                    <p>2 yr</p>
                  </Col>
                  <Col span={8}>
                    <p className="admin_experienceheading">CTC</p>
                    <p>3LPA</p>
                  </Col>
                  <Col span={8}>
                    <p className="admin_experienceheading">ECTC</p>
                    <p>5LPA</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}
