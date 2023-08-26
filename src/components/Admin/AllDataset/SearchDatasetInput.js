import { AutoComplete, Button, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";

export default function SearchDatasetInput() {
  const [users, setUsers] = useState([]);

  const handleSearch = async (text) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search/auto_complete?q=${text}`
      );
      console.log(response.data)
      if (response.data.ok) {
        setUsers(
          response.data.result?.map((item) => ({
            value: item.name,
            label: item.title,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AutoComplete
      options={users}
      size="large"
      className="w-full mb-5"
      placeholder="search dataset from name or description"
      allowClear={true}
      onSearch={handleSearch}
      onClear={() => setUsers([])}
      onSelect={(value) => (window.location.href = `/datasets/${value}`)}
    />
  );
}
