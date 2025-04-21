import { Ticket, User } from '@acme/shared-models';
import styles from './tickets.module.css';
import { Link, useNavigate } from 'react-router-dom';

export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
  onRefresh: () => void;
}

export function Tickets(props: TicketsProps) {
  const navigate = useNavigate();

  const handleClick = (userId: number, ticketId: number) => {
    navigate(`/${userId}/${ticketId}`);
  }

  const getAssignedTickets = (userId: number) => {
    return props.tickets.filter((t) => t.assigneeId === userId);
  }

  const completeTicket = (ticketId: number) => {
    console.log(ticketId); // TODO no API for completing ticket? ref: README
  }

  const createNewTicket = async (event: React.FormEvent<HTMLFormElement>, userId: number) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('newTicket') as HTMLInputElement;
    const value = input.value.trim();


    if (value) {
      input.value = '';

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: value }),
      }).then()

      const newTicket = await res.json();

      await assignTicketToUser(userId, newTicket.id);
    }
  }

  const assignTicketToUser = async (userId: number, ticketId: number) => {
    await fetch(`/api/tickets/${ticketId}/assign/${userId}`, {
      method: 'PUT',
    }).then()

    props.onRefresh();
  }


  return (
    <>
      <h2>Tickets</h2>
      {
        props.users && (
          <div className={styles['container']}>
            {props.users.map((u) => (
              <form key={u.id} className={styles['userGroup']} onSubmit={e => createNewTicket(e, u.id)}>
                <h3>{u.name}</h3>
                <ul>
                  {getAssignedTickets(u.id).map((t) => (
                    <li key={t.id} >
                      <button type="button" className={styles['emptyCheckbox']} onClick={() => completeTicket(t.id)} />
                      <Link className={styles['ticketLink']} to={`/${u.id}/${t.id}`} title="See ticket details">
                        Ticket: {t.id}, {t.description}
                      </Link>
                    </li>
                  ))}
                  <li><input type='text' name='newTicket' placeholder='New ticket..' /></li>
                </ul>
              </form>
            ))}
            {props.tickets && (
              <form className={styles['userGroup']} id="orphaned">
                <h3>Orphaned {':('}</h3>
                <ul>
                  {props.tickets.filter((t) => t.assigneeId === null).map((t) => (
                    <li key={t.id} >
                      <button title="See ticket details" onClick={() => handleClick(0, t.id)}>
                        Ticket: {t.id}, {t.description}
                      </button>
                    </li>
                  ))}
                  <li><input type='text' placeholder='New ticket..' /></li>
                </ul>
              </form>

            )}
          </div>
        )
      }
    </>
  );
}

export default Tickets;
