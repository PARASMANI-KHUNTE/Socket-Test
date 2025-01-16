import { useSelector } from "react-redux";

const ReduxData = () => {

  const {name,email, isAuthenticated } = useSelector((state) => state.user);

  

  return (
    <>
      
    </>
  );
};

export default ReduxData;
