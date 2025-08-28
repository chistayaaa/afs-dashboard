import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Contract } from "../../types/types";

import "./styles.scss";

const ContractorsPage: React.FC = observer(() => {
  const [contractors, setContractors] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      setLoading(true);
      // Load contractors from the store or API
    } catch (error) {
      console.error("Error in fetching the contractors:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h3 className="loading__title"> Loading...</h3>
      </div>
    );
  }

  return (
    <div className="page-contractors">
      <div className="page__header">
        <h1 className="page__title">Contractors</h1>
        <button className="btn btn__regular">Add contractors</button>
      </div>

      <div className="contractors-items"></div>

      {contractors.length === 0 && (
        <div className="empty-state">
          <h3 className="empty-state__title">No contractors found</h3>
        </div>
      )}
    </div>
  );
});

export default ContractorsPage;
