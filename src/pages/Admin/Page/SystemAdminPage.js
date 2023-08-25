import React from 'react'
import { Typography } from 'antd';
import AllSystemAdmin from '../../../components/Admin/SystemAdmin/AllSystemAdmin';
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
      <AllSystemAdmin />

      <Typography.Title level={3}>Promote user to Sysadmin</Typography.Title>
      <PromoteUser />
    </>
  );
}
