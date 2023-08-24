import React from 'react'
import AllUsersTable from '../../../components/Admin/AllUsers/AllUsersTable'
import SearchUserInput from '../../../components/Admin/AllUsers/SearchUserInput'
import { Typography } from 'antd'

export default function AllUsersPage() {
  return (
    <>
      <Typography.Title>
        Users
      </Typography.Title>
      <Typography.Paragraph>
        An easy to use UI to help administrators manage user indentities include blocking and band user.
      </Typography.Paragraph>

      <SearchUserInput />

      <AllUsersTable />
    </>
  )
}
