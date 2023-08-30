import React, { useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Typography, Divider, Button } from "antd";
import { useCreateModalStore } from "../../store";
import { useAuthUser } from "react-auth-kit";
import EditDetails from "./EditDetails";

const { Title } = Typography;

export default function ViewDetails({ userDetails }) {
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore();
  const { isEditMode, setIsEditMode } = useState(false);
  const auth = useAuthUser();

  if(true) {
    return(
      <EditDetails userDetails={userDetails} />
    )
  } else {
    return (
      <>
        <Avatar
          src={userDetails.image_display_url}
          size={256}
          className="ring-4"
        />
        <Title level={2}>{userDetails.fullname}</Title>
        <Title level={4} type="secondary">
          {userDetails.about ? userDetails.about : "No Bio"}
        </Title>

        {auth()?.id === userDetails.id && (
          <>
            <Divider>Options</Divider>

            <div className="flex gap-3 items-center justify-between">
              {!auth()?.is_admin && (
                <Button
                  icon={<PlusOutlined />}
                  size="large"
                  type="primary"
                  className="w-full"
                  onClick={() => setIsCreateModalShow(!isCreateModalShow)}
                >
                  Create Datasets
                </Button>
              )}
              <Button
                icon={<EditOutlined />}
                size="large"
                type="dashed"
                className="w-full"
              >
                Edit Profile
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
}
