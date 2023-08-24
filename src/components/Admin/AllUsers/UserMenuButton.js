import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import BanUserModal from "./BanUserModal";
import ChangeRoleModal from "./ChangeRoleModal";

export default function UserMenuButton({ user_name, user_id, is_admin }) {
  const [isBanModalShow, setIsBanModalShow] = useState(false);
  const [isRoleModalShow, setIsRoleModalShow] = useState(false);

  const items = [
    {
      key: "1",
      label: (
        <Link to={`/profile/${user_name}`} target="_blank">
          <Button type="ghost" style={{ margin: 0, padding: 0 }}>
            View Profile
          </Button>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="ghost" style={{ margin: 0, padding: 0 }} onClick={() => setIsRoleModalShow(true)}>
          Assign new role
        </Button>
      ),
    },
    {
      key: "3",
      danger: true,
      label: (
        <Button
          type="ghost"
          style={{ color: "red", margin: 0, padding: 0 }}
          onClick={() => setIsBanModalShow(true)}
        >
          Band this user
        </Button>
      ),
    },
  ];

  return (
    <>
      <ChangeRoleModal user_id={user_id} is_admin={is_admin} open={isRoleModalShow} close={() => setIsRoleModalShow(false)} />

      <BanUserModal user_id={user_id} open={isBanModalShow} close={() => setIsBanModalShow(false)} />

      <Dropdown
        trigger="click"
        placement="bottomRight"
        menu={{
          items,
        }}
      >
        <Button icon={<EllipsisOutlined />} />
      </Dropdown>
    </>
  );
}
