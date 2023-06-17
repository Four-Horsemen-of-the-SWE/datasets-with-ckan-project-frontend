import "./style.css";
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <>
      <section className="section--header w-100 h-96 flex justify-center items-center">
        <div className="container mx-auto text-center">
          <Title className="mt-0 uppercase">Datasets Hub</Title>
          <Text className="block mb-5 text-white capitalize">
            The datasets community, built with CKAN.
          </Text>

          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Datasets name."
              size="large"
            />
            <Button type="primary" size="large">
              Search
            </Button>
          </Space>
        </div>
      </section>
    </>
  );
}
