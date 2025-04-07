import React from "react";
import { Row, Col, Select } from "antd";
import Actelogo from "../images/acte-logo.png";
import { IoMdSearch } from "react-icons/io";
import "./styles.css";

export default function AdminSearch() {
  return (
    <div style={{ position: "relative" }}>
      <div className="candidate_headerContainer">
        <Row align="middle">
          <Col span={12} className="candidate_headerlogoContainer">
            <img src={Actelogo} className="candidateregister_actelogo" />
          </Col>
          <Col span={12} className="candidate_headertextContainer"></Col>
        </Row>
      </div>

      <div className="adminsearch_mainContainer">
        <p className="adminsearch_heading">Search</p>
        <p className="adminsearch_label">Keywords</p>
        <div style={{ position: "relative" }}>
          <Select
            className="adminsearch_inputfield"
            suffixIcon={false}
            mode="tags"
            open={false}
          />
          <IoMdSearch
            color="#0056b3"
            size={20}
            className="adminsearch_searchicon"
          />
        </div>
      </div>
    </div>
  );
}
