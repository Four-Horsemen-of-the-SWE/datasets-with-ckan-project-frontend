import { EyeOutlined, CheckOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button, Card, Image, Modal, Space, Typography } from "antd";
import { useState } from "react";
import moment from "moment/moment";

const { Meta } = Card;
const { Link, Paragraph } = Typography;

export default function DatasetsCard({
  thumbnail,
  title,
  description,
  date,
  author,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        centered
        title={`${title} Preview`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="preview"
            type="dashed"
            size="large"
            icon={<FullscreenOutlined />}
          >
            <Link href={`/datasets/${title}`}>View</Link>
          </Button>,
          <Button
            key="ok"
            onClick={handleCancel}
            type="primary"
            size="large"
            icon={<CheckOutlined />}
          >
            OK
          </Button>,
        ]}
      >
        <p>{description}</p>
      </Modal>

      <Card
        hoverable
        loading={false}
        className="shadow-sm"
        cover={<img alt="thumbnail" src={thumbnail} />}
        actions={[
          author,
          moment(date).format("MMM Do YY"),
          <EyeOutlined key="bookmark" onClick={() => setIsModalOpen(true)} />,
        ]}
      >
        <Link href={`/datasets/${title}`}>
          <Meta
            title={title}
            description={
              <Paragraph ellipsis={{ rows: 4, symbol: "more" }}>
                {description}
              </Paragraph>
            }
          />
        </Link>
      </Card>
    </>
  );
}
