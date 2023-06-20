import { CloudDownloadOutlined } from "@ant-design/icons";
import { Alert, Card, Typography, Tag, Space } from "antd"
import moment from "moment/moment";
import { Link } from "react-router-dom";

const { Title, Text } = Typography

export default function ResourceView({ resource }) {
  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Resource</Title>
        <Text type="secondary">{resource.length} Resources</Text>

        {/* if data is empty */}
        {!resource.length && (
          <Alert
            showIcon
            type="info"
            message="No resource"
            description="The dataset might not be uploaded at this time. Please come back later."
            className="my-3"
          />
        )}

        {/* else */}
        {resource.map((item, key) => (
          <Card
            title={item.name}
            className="my-3"
            key={key}
            actions={[
              <Text>{`${item.size}`}</Text>,
              <Text>{moment(item.last_modified, "YYYYMMDD").fromNow()}</Text>,
              <Tag color="green">{item.format}</Tag>,
              <Link to={item.url}>
                <Tag color="blue">
                  <Space>
                    <CloudDownloadOutlined />
                    Download
                  </Space>
                </Tag>
              </Link>,
            ]}
          >
            <Card.Meta description={item.description} />
          </Card>
        ))}
      </div>
    </>
  );
}