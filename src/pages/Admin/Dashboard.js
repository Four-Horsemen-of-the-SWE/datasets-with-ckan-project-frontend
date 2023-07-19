import { useEffect } from "react";
import { Typography } from "antd";
import { useAuthUser } from "react-auth-kit";
import { redirect } from "react-router-dom";

const { Title } = Typography;

export default function Dashboard() {
  const auth = useAuthUser();

  useEffect(() => {
    // if user is not admin.
    if(!auth().is_admin) {
      redirect('/');
    }
  }, []);

  return(
    <>
      <div className="container mx-auto">
        <Title level={2}>Main Dashboard</Title>
        
      </div>
    </>
  );
}