import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import {useAuthHeader} from 'react-auth-kit'
import axios from 'axios';
import columns from './columns'

export default function AllSystemAdmin() {
  const authHeader = useAuthHeader()
  const [users, setUsers] = useState([]);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1]
    }
  }
  
  const fetchAdmin = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/admins`,
        config
      );
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={users}
    />
  )
}
