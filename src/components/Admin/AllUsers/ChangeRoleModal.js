import { Modal, Typography, Space, Button } from "antd"
import React from 'react'

export default function ChangeRoleModal({ open, close, is_admin }) {
  return (
    <Modal title="Change role" open={open} onCancel={close} width={"30%"}>
      {is_admin ? (
        <div className="flex w-full justify-between items-baseline">
          <Space direction="vertical">
            <Typography.Title level={4}>Members</Typography.Title>
            <Typography.Text>
              Member can only create, update, delete own dataset. They can also
              see other people's dataset.
            </Typography.Text>
          </Space>
          <Button>Change to Member</Button>
        </div>
      ) : (
        <div className="flex w-full justify-between items-center">
          <Space direction="vertical">
            <Typography.Title level={4}>Administrators</Typography.Title>
            <Typography.Text>
              Administrators can delte other datase. They can also manage user
              role and ban other user
            </Typography.Text>
          </Space>
          <Button>Change to Administrators</Button>
        </div>
      )}
    </Modal>
  );
}
