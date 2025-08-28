import "./styles.scss";
import { ReactComponent as TrashIcon } from "../../../assets/images/svg/Trash.svg";

interface ImageItemProps {
  onDelete?: () => void;
  imageSrc: string;
  imageAlt: string;
}

const ImageItem: React.FC<ImageItemProps> = ({
  onDelete,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="image-item">
      <button onClick={onDelete} className="btn__icon  image-item__btn-delete">
        <TrashIcon width={16} height={16} />
      </button>
      <img alt={imageAlt} src={imageSrc} />
    </div>
  );
};

export default ImageItem;
