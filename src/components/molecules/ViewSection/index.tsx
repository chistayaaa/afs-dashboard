import "./styles.scss";
import { ReactComponent as EditIcon } from "../../../assets/images/svg/Edit.svg";
import { ReactComponent as PhotoIcon } from "../../../assets/images/svg/Photo.svg";

interface ViewSectionProps {
  title: string;
  type?: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
}

const ViewSection: React.FC<ViewSectionProps> = ({
  title,
  children,
  type = "edit",
  onEdit,
  onAdd,
}) => {
  return (
    <div className="view-section">
      <div className="view-section__header">
        <h5>{title}</h5>
        {type === "edit" ? (
          <button className="btn btn__flattened" onClick={onEdit}>
            <EditIcon width={16} height={16} /> Edit
          </button>
        ) : (
          <button className="btn btn__flattened" onClick={onAdd}>
            <PhotoIcon width={16} height={16} /> Add
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default ViewSection;
