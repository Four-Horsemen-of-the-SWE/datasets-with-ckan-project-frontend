import { AutoComplete } from 'antd'
import React from 'react'

export default function PromoteUser() {
  return (
    <>
      <AutoComplete 
        className="w-full"
        size="large"
        placeholder="username"
      />
    </>
  )
}
