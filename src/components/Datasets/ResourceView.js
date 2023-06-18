import { Alert, Typography } from "antd"

const { Title, Text } = Typography

export default function ResourceView() {
  const data = []
  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Resource</Title>
        <Text type="secondary">0 Resources</Text>

        {/* if data is empty */}
        {!data.length && (
          <Alert
            showIcon
            type="info"
            message="No resource"
            description="The dataset might not be uploaded at this time. Please come back later."
            className="my-3"
          />
        )}
      </div>
    </>
  );
}