import React from 'react'
import { Typography } from 'antd';
import AllSystemAdminTable from "../../../components/Admin/SystemAdmin/AllSystemAdminTable";
import PromoteUser from '../../../components/Admin/SystemAdmin/PromoteUser';

export default function SystemAdminPage() {
  return (
    <>
      <Typography.Title>Administer</Typography.Title>
      <Typography.Paragraph>
        As a system admin user you have full control over this website instance.
        Proceed with care!
      </Typography.Paragraph>

      <Typography.Title level={3}>Current Sysadmins</Typography.Title>
      <AllSystemAdminTable />

      <Typography.Title level={3}>Promote user to Sysadmin</Typography.Title>
      <PromoteUser />
    </>
  );
}
