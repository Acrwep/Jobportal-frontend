import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./styles.css";
import { Row, Col, Modal } from "antd";
import { TbEdit } from "react-icons/tb";
import {
  getFolders,
  getMultipleCandidatesById,
  updateFolder,
} from "../Common/action";
import { storeFolderProfiles } from "../Redux/slice";
import { useDispatch } from "react-redux";
import moment from "moment";
import CommonInputField from "../Common/CommonInputField";
import { addressValidator } from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";

export default function FolderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [folderNameError, setFolderNameError] = useState("");

  useEffect(() => {
    getFoldersData();
  }, []);

  const getFoldersData = async () => {
    const userId = localStorage.getItem("loginUserId");
    try {
      const response = await getFolders(userId);
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

  const handleModal = async () => {
    const nameValidate = addressValidator(folderName);

    setFolderNameError(nameValidate);

    if (nameValidate) return;

    const payload = {
      name: folderName,
      folderId: folderId,
    };

    try {
      const response = await updateFolder(payload);
      CommonToaster("updated");
      setIsModalOpen(false);
      getFoldersData();
    } catch (error) {
      console.log(error);
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
                  <div className="folders_listContainer">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12}>
                        <p
                          className="folders_listname_text"
                          onClick={() => handleClickedFolder(item)}
                        >
                          {item.name}
                        </p>
                        <p className="folders_listcreatedat_text">
                          Created At:{" "}
                          {moment(item.createdAt).format("YYYY-MM-DD hh:mm A")}
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
                        <TbEdit
                          size={24}
                          onClick={() => {
                            setIsModalOpen(true);
                            setFolderId(item.id);
                          }}
                          style={{ cursor: "pointer" }}
                        />
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

      <Modal
        title="Update Folder"
        open={isModalOpen}
        onOk={handleModal}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={[
          <button className="admin_modalsubmitbutton" onClick={handleModal}>
            Submit
          </button>,
        ]}
      >
        <div>
          <CommonInputField
            label="Name"
            mandatory={true}
            onChange={(e) => {
              setFolderName(e.target.value);
              setFolderNameError(addressValidator(e.target.value));
            }}
            value={folderName}
            error={folderNameError}
          />
        </div>
      </Modal>
    </div>
  );
}
