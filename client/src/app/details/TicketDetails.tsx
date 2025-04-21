import { Ticket } from '@acme/shared-models';
import styles from './TicketDetails.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface TicketDetails extends Ticket {
  assigneeName: string;
}


const TicketDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);


  useEffect(() => {
    const ticketFetch: Promise<Response> = fetch(`/api/tickets/${ticketId}`);
    const userFetch: Promise<Response> = fetch(`/api/users/${userId}`);

    const promises = Promise.all([ticketFetch, userFetch])

    if (ticketId && userId) {
      promises.then(async ([ticketRes, userRes]) => {
        const ticketData: Ticket = await ticketRes.json();
        const userData = await userRes.json();

        const ticketDetails: TicketDetails = {
          ...ticketData,
          assigneeName: userData.name,
          assigneeId: userData.id,
        }

        setTicket(ticketDetails);
      })
    }
  }, [ticketId, userId]);

  return (
    <div className={styles['container']}>
      <h1>{ticket?.description}</h1>

      <div className={styles['details']}>
        <p>Assigned to: {ticket?.assigneeName}</p>
        <p>Completed: {ticket?.completed ? <span>Yes</span> : <span>No</span>}</p>
      </div>
    </div>
  );
}

export default TicketDetails;
