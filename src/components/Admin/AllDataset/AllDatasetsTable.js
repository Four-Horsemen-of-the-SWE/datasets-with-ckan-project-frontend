import React, { useState, useEffect } from "react";
import { Table,} from "antd";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

// import components
import columns from "./columns";

export default function AllDatasetsTable() {
  const [allDatasets, setAllDatasets] = useState([]);

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
