import React from 'react'
import AllUsersTable from '../../../components/Admin/AllUsers/AllUsersTable'
import SearchUserInput from '../../../components/Admin/AllUsers/SearchUserInput'

export default function AllUsersPage() {
  return (
    <>
      <SearchUserInput />

      <AllUsersTable />
    </>
  )
}
