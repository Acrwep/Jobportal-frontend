import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./styles.css";
import { Row, Col } from "antd";
import { TbEdit } from "react-icons/tb";
import {
  getCandidates,
  getFolders,
  getMultipleCandidatesById,
} from "../Common/action";
import { storeFolderFilters, storeFolderProfiles } from "../Redux/slice";
import { useDispatch } from "react-redux";

export default function FolderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    getFoldersData();
  }, []);

  const getFoldersData = async () => {
    try {
      const response = await getFolders();
      console.log(response);
      setFolders(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickedFolder = async (item) => {
    console.log("clicked item", item);
    const payload = {
      candidateIds: JSON.parse(item.candidateIds),
    };
    // dispatch(storeFolderFilters([payload]));
    try {
      const response = await getMultipleCandidatesById(payload);
      console.log("candidates response", response?.data?.data);
      dispatch(storeFolderProfiles(response?.data?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        navigate("/folderprofiles");
      }, 300);
    }
  };

  return (
    <div className="folder_mainContainer">
      <Header />

      <div className="folders_innercontainer">
        <p className="folders_heading">Folder Management</p>
        {folders.length >= 1 ? (
          <>
            {folders.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <div
                    className="folders_listContainer"
                    onClick={() => handleClickedFolder(item)}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <p className="folders_listname_text">{item.name}</p>
                        <p className="folders_listcreatedat_text">
                          Created At: Mar 3, 2025, 12:52 PM
                        </p>
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
                        <TbEdit size={24} />
                      </Col>
                    </Row>
                  </div>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <div className="folders_nodatadiv">
            <p>No data found</p>
          </div>
        )}
      </div>
    </div>
  );
}
