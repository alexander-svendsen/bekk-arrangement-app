import React from 'react';
import {
  IEditEvent,
  initialEditEvent,
  toEditEvent,
  parseEditEvent,
} from 'src/types/event';
import { eventsRoute, previewNewEventRoute } from 'src/routing';
import { useAuthentication } from 'src/auth';
import { Page } from 'src/components/Page/Page';
import { Button } from 'src/components/Common/Button/Button';
import { EditEvent } from 'src/components/EditEvent/EditEvent/EditEvent';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';
import style from './CreateEventContainer.module.scss';
import { isValid } from 'src/types/validation';
import { usePersistentHistoryState } from 'src/utils/browser-state';
import { useGotoEventPreview } from 'src/hooks/history';

export const CreateEventContainer = () => {
  useAuthentication();

  const [event, setEvent] = usePersistentHistoryState<IEditEvent>(
    initialEditEvent()
  );
  const validEvent = validateEvent(event);
  const errors = parseEditEvent(event);

  const gotoPreview = useGotoEventPreview(previewNewEventRoute);

  const redirectToPreview =
    validEvent &&
    (() => {
      gotoPreview(validEvent);
    });

  return (
    <Page>
      <h1 className={style.header}>Opprett arrangement</h1>
      <EditEvent eventResult={event} updateEvent={setEvent} />
      <div className={style.buttonContainer}>
        <Button
          onClick={redirectToPreview || (() => {})}
          disabled={!redirectToPreview}
          disabledResaon={
            <ul>
              {Array.isArray(errors) &&
                errors.map((x) => <li key={x.message}>{x.message}</li>)}
            </ul>
          }
        >
          Forhåndsvisning
        </Button>
        <BlockLink to={eventsRoute} onLightBackground>
          Avbryt
        </BlockLink>
      </div>
    </Page>
  );
};

const validateEvent = (event?: IEditEvent) => {
  if (event) {
    const validEvent = parseEditEvent(event);
    if (isValid(validEvent)) {
      return validEvent;
    }
  }
};
