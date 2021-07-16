import React from 'react';
import logo from 'src/images/logo.svg';
import logoBlack from 'src/images/logoBlack.svg';
import style from './Header.module.scss';
import {
  eventsRoute,
  useIsCreateRoute,
  useIsEditingRoute,
  useIsPreviewRoute,
} from 'src/routing';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export const Header = () => {
  const shouldHaveBlackHeader = useShouldHaveBlackHeaderBackground();
  const headerStyle = classNames(style.logoContainer, {
    [style.coloredHeader]: !shouldHaveBlackHeader,
  });

  const headerLogo = shouldHaveBlackHeader ? logo : logoBlack;

  return (
    <div className={headerStyle}>
      <Link to={eventsRoute}>
        <img className={style.logo} src={headerLogo} alt="logo" />
      </Link>
    </div>
  );
};

export const useShouldHaveBlackHeaderBackground = () => {
  let isEditingRoute = useIsEditingRoute();
  let isPreviewRoute = useIsPreviewRoute();
  let isCreateRoute = useIsCreateRoute();
  return isEditingRoute || isPreviewRoute || isCreateRoute;
};
