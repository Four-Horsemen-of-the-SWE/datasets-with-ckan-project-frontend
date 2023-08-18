import { useEffect } from "react";
import { DatabaseOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import { redirect, Link } from "react-router-dom";
import { Layout, Menu } from "antd";

// import components
import AllDatasetsTable from "../../components/Admin/AllDatasetsTable";
import siderItems from "./siderItems";

export default function Dashboard() {
  const auth = useAuthUser();
  useEffect(() => {
    // if user is not admin.
    if (!auth()?.is_admin) {
      window.location.href = "/";
    }
  }, []);

  return (
    <Layout>
      <Layout style={{ height: "100% !important" }}>
        <Layout.Sider width={300}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["datasets"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={siderItems}
          />
        </Layout.Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Layout.Content
            style={{
              padding: 24,
              margin: 0,
              height: "auto",
            }}
          >
            <AllDatasetsTable />
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
}