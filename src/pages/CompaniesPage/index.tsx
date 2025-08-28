import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { useStores } from "../../stores";

import "./styles.scss";
import CompanyCard from "../../components/molecules/CompanyCard";
import { useLocation } from "react-router-dom";

const CompaniesPage: React.FC = observer(() => {
  const location = useLocation();
  const { organizationStore } = useStores();

  const searchParams = new URLSearchParams(location.search);
  const isDeleteTest = searchParams.has("delete-test");

  useEffect(() => {
    organizationStore.loadCompanies(isDeleteTest);
  }, [organizationStore, isDeleteTest]);

  return (
    <div className="page-companies">
      <div className="page__header">
        <h1 className="page__title">Companies</h1>
        <button
          className="btn btn__regular"
          disabled={organizationStore.isLoading}
        >
          Add company
        </button>
      </div>

      {organizationStore.isLoading ? (
        <div className="loading">
          <h3 className="loading__title"> Loading...</h3>
        </div>
      ) : (
        <>
          <div className="companies__grid">
            {organizationStore.companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          {organizationStore.companies.length === 0 && (
            <div className="empty-state">
              <h3 className="empty-state__title">No companies found</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default CompaniesPage;
