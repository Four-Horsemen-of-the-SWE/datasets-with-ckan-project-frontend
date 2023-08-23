import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import AllDatasetsTable from "../../components/Admin/AllDatasetsTable";

export default function AllDatasetsPage() {
  return (
    <>
      <Row gutter={16} className="mb-5">
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <AllDatasetsTable />
    </>
  );
}
