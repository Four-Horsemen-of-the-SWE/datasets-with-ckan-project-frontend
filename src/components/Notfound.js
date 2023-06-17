import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="flex h-screen w-full container mx-auto justify-center items-center">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Homepage</Button>
          </Link>
        }
      />
    </div>
  );
}