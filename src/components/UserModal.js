import { useSelector } from "react-redux";
import ModalContent from "./ModalContent";

function UserModal() {
  const node = useSelector((s) =>
    s.network.graph?.nodes.find((n) => n.id === s.network.selectedId),
  );
  return node ? <ModalContent node={node} /> : null;
}

export default UserModal;
