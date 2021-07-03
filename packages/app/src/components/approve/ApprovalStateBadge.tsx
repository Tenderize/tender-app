import { FC } from "react";
import { Spinner } from "react-bootstrap";
import useStore from "../../store";

const ApprovalStateBadge: FC = () => {
  const approvalState = useStore((state) => state.approvalState);

  return (
    <>{approvalState !== "None" && approvalState !== "Success" && <Spinner animation="border" variant="primary" />}</>
  );
};

export default ApprovalStateBadge;
