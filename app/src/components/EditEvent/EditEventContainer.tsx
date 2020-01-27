import { useState, useEffect } from 'react';
import React from 'react';
import {
  parseEvent,
  IEditEvent,
  deserializeEvent,
  IEvent,
} from 'src/types/event';
import { putEvent, getEvent, deleteEvent } from 'src/api/arrangementSvc';
import { useParams, useHistory } from 'react-router';
import { isOk, Result } from 'src/types/validation';
import { EditEvent } from './EditEvent/EditEvent';
import { Button } from '../Common/Button/Button';
import { PreviewEvent } from '../PreviewEvent/PreviewEvent';
import { useAuthentication } from 'src/auth';
import { Page } from '../Page/Page';
import style from './EditEventContainer.module.scss';
import { eventsRoute, getViewEventRoute } from 'src/routing';

export const EditEventContainer = () => {
  useAuthentication();
  const { id } = useParams();

  const [event, setEvent] = useState<Result<IEditEvent, IEvent>>();
  const [previewState, setPreviewState] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (id) {
      const get = async () => {
        const retrievedEvent = await getEvent(id);
        setEvent(parseEvent(deserializeEvent(retrievedEvent)));
      };
      get();
    }
  }, [id]);

  if (!event || !id) {
    return <div>Loading</div>;
  }

  const editEventFunction = async () => {
    if (isOk(event)) {
      const updatedEvent = await putEvent(id, event.validValue);
      setEvent(parseEvent(deserializeEvent(updatedEvent)));
      history.push(getViewEventRoute(id));
    } else {
      throw Error('feil');
    }
  };

  const goToOverview = () => history.push(eventsRoute);
  const updateEvent = (editEvent: IEditEvent) =>
    setEvent(parseEvent(editEvent));

  const onDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    goToOverview();
  };

  const renderEditView = () => (
    <Page>
      <h1 className={style.header}>Endre event</h1>
      <EditEvent eventResult={event.editValue} updateEvent={updateEvent} />
      <Button onClick={() => setPreviewState(true)} disabled={!isOk(event)}>
        Forhåndsvisning
      </Button>
      <div className={style.buttonContainer}>
        <Button onClick={goToOverview}>Avbryt</Button>
        <Button onClick={() => onDeleteEvent(id)}>Slett</Button>
      </div>
    </Page>
  );

  const renderPreviewEvent = () => {
    if (isOk(event)) {
      return (
        <Page>
          <PreviewEvent event={event.validValue} />
          <div className={style.buttonContainer}>
            <Button onClick={editEventFunction}>Oppdater event</Button>
            <Button onClick={() => setPreviewState(false)}>Tilbake</Button>
          </div>
        </Page>
      );
    }
  };

  return !previewState ? renderEditView() : renderPreviewEvent() || null;
};
