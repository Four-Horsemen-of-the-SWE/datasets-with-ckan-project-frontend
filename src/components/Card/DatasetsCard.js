import { EyeOutlined, CheckOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button, Card, Image, Modal, Space, Typography } from "antd";
import { useState } from "react";
// import { Link } from "react-router-dom";
import moment from "moment/moment";

const { Meta } = Card;
const { Paragraph, Link } = Typography;

export default function DatasetsCard({
  thumbnail,
  title,
  notes,
  metadata_modified,
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
      {/* preview modal */}
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
        <p>{notes}</p>
      </Modal>

      {/* datasets card */}
      <Card
        hoverable
        loading={false}
        className="shadow-sm h-full"
        cover={
          <img
            alt="thumbnail"
            src={
              thumbnail
                ? thumbnail
                : "https://i.ytimg.com/vi/VHwfiPt042k/maxresdefault.jpg"
            }
          />
        }
        actions={[
          <Link href={`/profile/${author ? author : 'Admin'}`}>{author ? author : "Admin"}</Link>,
          moment(metadata_modified).format("MMM Do YY"),
          <EyeOutlined key="bookmark" onClick={() => setIsModalOpen(true)} />,
        ]}
      >
        <Link href={`/datasets/${title}`}>
          <Meta
            title={title}
            description={<Paragraph ellipsis={{ rows: 3 }}>{notes}</Paragraph>}
          />
        </Link>
      </Card>
    </>
  );
}
