import { EyeOutlined, CheckOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Typography } from "antd";
import { useState } from "react";
// import { Link } from "react-router-dom";
import moment from "moment/moment";

const { Meta } = Card;
const { Paragraph, Link } = Typography;

export default function DatasetsCard({
  id,
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
            <Link href={`/datasets/${id}`}>View</Link>
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
        <Link href={`/datasets/${id}`}>
          <Meta
            title={title}
            description={<Paragraph ellipsis={{ rows: 3 }}>{notes ? notes : "No Description"}</Paragraph>}
            className="h-24"
          />
        </Link>
      </Card>
    </>
  );
}
