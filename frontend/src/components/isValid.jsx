import { Button, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function IsValid({locate}) {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  let {role,permission} = useSelector((state) => state.role);

  return permission?.includes(locate) ? (
    <Outlet />
  ) : (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => {
        navigation("/")
    }}>
        Back Home
        </Button>
      }
    />
  );
}

// export function LoggedId() {
//   const dispatch = useDispatch();
//   const role = useSelector((state) => state.role);
//   return role ? <Outlet /> : <Navigate to="/" />;
// }

export default IsValid;
