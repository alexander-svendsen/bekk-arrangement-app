import React from 'react';
import { DateInput } from '../DateInput/DateInput';
import { TimeInput } from '../TimeInput/TimeInput';
import { EditDateTime, parseEditDateTime } from 'src/types/date-time';
import style from './DateTimeInput.module.scss';
import classNames from 'classnames';
import { ValidationResult } from '../ValidationResult/ValidationResult';
import { isValid } from 'src/types/validation';

interface IProps {
  label: string;
  value: EditDateTime;
  onChange: (datetime: EditDateTime) => void;
}

export const DateTimeInput = ({ label, value, onChange }: IProps) => {
  const dateTime = parseEditDateTime(value);

  const containerStyle = classNames(style.container, {
    [style.error]: !isValid(dateTime),
  });
  return (
    <section className={style.grid}>
      <label className={style.label}>{label}</label>
      <div className={containerStyle}>
        <DateInput
          value={value.date}
          onChange={date => {
            onChange({ ...value, date });
          }}
        />
        <TimeInput
          value={value.time}
          onChange={time => onChange({ ...value, time })}
        />
      </div>
      {!isValid(dateTime) && <ValidationResult validationResult={dateTime} />}
    </section>
  );
};
