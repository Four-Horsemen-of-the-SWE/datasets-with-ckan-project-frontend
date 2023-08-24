import React, { useState, useEffect } from "react";
import { Table,} from "antd";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

// import components
import columns from "./columns";
import DeleteDatasetModal from "./DeleteDatasetModal";

export default function AllDatasetsTable() {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [allDatasets, setAllDatasets] = useState([]);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const JWTToken = authHeader().split(" ")[1];

  const fetchAllDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`
      );
      if (response.status === 200) {
        setAllDatasets(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllDatasets();
  }, []);

  return (
    <Table
      pagination={true}
      columns={columns}
      dataSource={allDatasets}
      style={{ width: "100%" }}
    />
  );
}
