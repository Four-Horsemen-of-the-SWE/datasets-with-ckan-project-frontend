import { Button, Input, Modal, Typography, message } from "antd";
import axios from "axios";
import { useState } from "react";

export default function ArticleDeleteModal({ article_id, open, close}) {
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState("");

  const handleDelete = async() => {
    try {
      setDeleting(true);
      if(confirm.length === 0) {
        setDeleting(false);
        return message.warning("Please fill the text field.")
      }

      if (confirm === "DELETE") {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/articles/${article_id}`
        );
        if(response.data.ok) {
          message.success("Successfully deleted.");
          setTimeout(() => {
            setDeleting(false);
            window.location.reload();
          }, 200);
        }
      } else {
        message.info("Please fill in the confirmation message correctly.");
        setDeleting(false);
      }
    } catch(error) {
      setDeleting(false);
      console.error(error);
    }
  }

  return (
    <Modal
      title="Are you sure to delete this article ?"
      open={open}
      onCancel={close}
      close={close}
      centered={true}
      footer={[
        <Button size="large" onClick={close} disabled={deleting}>Cancel</Button>,
        <Button size="large" type="primary" danger={true} onClick={handleDelete} loading={deleting}>Delete</Button>
      ]}
    >
      <div className="flex flex-col gap-3 mt-5">
        <Typography.Text>
          This will permanently delete this article.
          Plese type DELETE in the text field below to confirm deletion of an article.
        </Typography.Text>
        <Input name="confirm" onChange={(e) => setConfirm(e.target.value)} size="large" placeholder="DELETE" disabled={deleting} />
      </div>
    </Modal>
  );
}