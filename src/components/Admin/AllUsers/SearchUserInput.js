import { AutoComplete, Button, Typography } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'

export default function SearchUserInput() {
  const [users, setUsers] = useState([]);

  const handleSearch = async(text) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/auto_complete?q=${text}`
      );
      if(response.data.ok) {
        setUsers(response.data.result?.map(item => ({value: item.name, label: item.fullname})));
      }
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <AutoComplete
      options={users}
      size="large"
      className="w-full mb-5"
      placeholder="search user from username or fullname"
      allowClear={true}
      onSearch={handleSearch}
      onClear={() => setUsers([])}
      onSelect={(value) => (window.location.href = `/profile/${value}`)}
    />
  );
}
