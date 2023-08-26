import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

import columns from "./columns";

export default function AllUsersTable() {
  const [users, setUser] = useState([]);

  const fetchAllUsers = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users`
      );
      if(response.data.ok) {
        setUser(response.data.result)
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <Table
      pagination={true}
      columns={columns}
      dataSource={users}
      style={{ width: "100%" }}
    />
  );
}
