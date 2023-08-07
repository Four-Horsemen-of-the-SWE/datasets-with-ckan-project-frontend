import axios from "axios";
import React, { useState} from "react";
import { useAuthHeader } from "react-auth-kit";
import { DeleteOutlined} from "@ant-design/icons";
import { Popconfirm, Button, message } from "antd";
import { useResourcesStore } from "../../store";

export default function DeleteResouceButton({ resource_id }) {
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];
  const [isDeleting, setIsDeleting] = useState(false);

  // store
  const { resources, setResources } = useResourcesStore();

  const handleDelete = async (resource_id) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/resources/${resource_id}`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if (response.data.ok) {
        message.success("Delete success.");
        // set with new resouces
        const new_data = resources.filter(
          (item) => item.id !== response.data.result
        );
        setResources(new_data);

        setIsDeleting(false);
      }
    } catch (error) {
      setIsDeleting(false);
      message.error(error.message);
    }
  };
  return (
    <>
      <Popconfirm
        title="Delete the file."
        description="Are you sure to delete this file?"
        onConfirm={() => handleDelete(resource_id)}
        placement="bottom"
      >
        <Button
          type="ghost"
          loading={isDeleting}
          danger={true}
          style={{ color: "red" }}
        >
          {!isDeleting && <DeleteOutlined />}
        </Button>
      </Popconfirm>
    </>
  );
}
