import { Link } from "react-router-dom";
import { Company } from "../../../types/types";

import "./styles.scss";

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const hasImage = company.photos && company.photos.length > 0;
  const imageUrl = hasImage ? company.photos[0]?.filepath : null;

return (
    <Link 
      className={`company-card ${hasImage ? 'company-card--with-image' : 'company-card--no-image'}`}
      to={`/companies/${company.id}`}
      style={hasImage ? { 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${imageUrl})` 
      } : {}}
    >
      <h3 className="company-card__title">{company.name}</h3>
    </Link>
  );
};

export default CompanyCard;
