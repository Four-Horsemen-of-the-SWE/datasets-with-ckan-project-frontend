import { Alert, Typography } from "antd";

const { Title, Text } = Typography;

export default function InformationView() {
  const data = [];
  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Data</Title>
        <Text type="secondary">Additional Information</Text>

        {/* if data is empty */}
        {!data.length && (
          <Alert
            showIcon
            type="info"
            message="No information"
            className="my-3"
          />
        )}
      </div>
    </>
  );
}
