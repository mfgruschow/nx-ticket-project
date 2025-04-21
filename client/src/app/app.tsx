import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import TicketDetails from './details/TicketDetails';

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [refresh, setRefresh] = useState(0);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchTickets() {
      const data = await fetch('/api/tickets').then();
      setTickets(await data.json());
    }

    async function fetchUsers() {
      const data = await fetch('/api/users').then();
      setUsers(await data.json());
    }

    fetchTickets();
    fetchUsers();
  }, [refresh]);

  const triggerRefresh = () => {
    console.log('triggered a refresh')
    setRefresh((prev) => prev + 1);
  }

  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route path="/" element={<Tickets tickets={tickets} users={users} onRefresh={triggerRefresh} />} />
        <Route path="/:userId/:ticketId" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
