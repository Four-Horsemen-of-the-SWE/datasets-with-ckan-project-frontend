import React from 'react'
import AllUsersTable from '../../../components/Admin/AllUsers/AllUsersTable'
import SearchUserInput from '../../../components/Admin/AllUsers/SearchUserInput'
import { Card, Typography, Statistic } from 'antd'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

export default function AllUsersPage() {
  const [numberOfUsers, setNumberOfUsers] = useState(0);

  const fetchNumberOfUsers = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users?all_fields=${false}`
      );
      if(response.data.ok) {
        setNumberOfUsers(response.data.result?.length);
      }
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNumberOfUsers();
  }, []);
  return (
    <>
      <Typography.Title>Users</Typography.Title>
      <Typography.Paragraph>
        An easy to use UI to help administrators manage user indentities include
        blocking and band user.
      </Typography.Paragraph>
      <Card bordered={false} className="mb-5">
        <Statistic
          title="All users"
          value={numberOfUsers}
          precision={0}
          valueStyle={{
            color: "#3f8600",
          }}
        />
      </Card>

      <SearchUserInput />

      <AllUsersTable />
    </>
  );
}
