import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import AllDatasetsTable from "../../../components/Admin/AllDatasetTable/AllDatasetsTable";

export default function AllDatasetsPage() {
  return (
    <>
      <Row gutter={16} className="mb-5">
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="All Datasets"
              value={11.28}
              precision={0}
              valueStyle={{
                color: "#3f8600",
              }}
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
