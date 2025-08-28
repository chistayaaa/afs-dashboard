import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Client } from "../../types/types";

import "./styles.scss";

const ClientsPage: React.FC = observer(() => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      // Load clients from the store or API
    } catch (error) {
      console.error("Error in fetching the clients:", error);
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
    <div className="page-clients">
      <div className="page__header">
        <h1 className="page__title">Clients</h1>
        <button className="btn btn__regular">Add clients</button>
      </div>

      <div className="clients-items"></div>

      {clients.length === 0 && (
        <div className="empty-state">
          <h3 className="empty-state__title">No clients found</h3>
        </div>
      )}
    </div>
  );
});

export default ClientsPage;
