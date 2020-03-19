import React from "/vendor/react";
import { animated, useSpring } from "/vendor/react-spring";
import { KeyboardArrowDownIcon } from "/lib/component/icon";
import { NavLink as RouterLink } from "/vendor/react-router-dom";
import {
  Box,
  ListItem,
  Theme,
  Tooltip,
  Typography,
  createStyles,
  makeStyles,
} from "/vendor/@material-ui/core";

import IconContainer from "./IconContainer";
import { LinkConfig } from "./types";
import { heights } from "./constants";

interface LinkProps {
  adornment?: React.ReactElement;
  collapsed?: boolean;
  contents: React.ReactElement;
  disabled?: boolean;
  hint?: React.ReactElement;
  href?: string;
  icon?: React.ReactElement;
  onClick?: () => void;
}

interface ListItemButtonProps {
  children: (React.ReactElement | undefined)[];
  disabled: boolean;
  to?: string;
  onClick?: () => void;
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      active: {
        backgroundColor: theme.palette.action.hover,
      },
    }),
  { name: "ListItemButton" },
);

const ListItemButton = ({
  children,
  disabled,
  to,
  onClick,
}: ListItemButtonProps) => {
  const classes = useStyles();

  return (
    // @ts-ignore
    <ListItem
      activeClassName={classes.active}
      button
      component={to ? RouterLink : "button"}
      disabled={disabled}
      disableGutters
      dense
      to={to}
      onClick={onClick}
    >
      {children}
    </ListItem>
  );
};

const Link = ({
  adornment,
  collapsed = false,
  contents,
  disabled = false,
  hint,
  href,
  icon,
  onClick,
}: LinkProps) => {
  const link = (
    <Box display="flex" justifyContent="left" height={heights.menuitem}>
      <ListItemButton
        disabled={disabled || (!href && !onClick)}
        to={href}
        onClick={onClick}
      >
        <IconContainer icon={icon} />
        <Box
          clone
          display="flex"
          alignItems="center"
          marginLeft={1}
          flexGrow="1"
        >
          <Typography variant="body1" color="inherit" noWrap>
            {contents}
          </Typography>
        </Box>
        {adornment && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={48}
            height={48}
          >
            {adornment}
          </Box>
        )}
      </ListItemButton>
    </Box>
  );

  if (collapsed) {
    return (
      <Tooltip title={hint || contents} placement="right">
        {link}
      </Tooltip>
    );
  }

  return link;
};

interface FolderProps {
  contents: React.ReactElement;
  disabled: boolean;
  expanded: boolean;
  hint?: React.ReactElement;
  icon?: React.ReactElement;
  links: LinkConfig[];
  onExpand: () => void;
}

const Folder = ({
  icon,
  contents,
  links,
  expanded,
  onExpand,
  ...props
}: FolderProps) => {
  const childStyles = useSpring({
    from: {
      height: 0,
      opacity: 0,
    },
    to: {
      height: expanded ? links.length * heights.menuitem : 0,
      opacity: expanded ? 1 : 0,
    },
  });

  const adnormentStyles = useSpring({
    transform: expanded
      ? "rotateX(180deg) translateY(5%)"
      : "rotateX(0deg) translateY(0px)",
  });

  return (
    <React.Fragment>
      <Link
        {...props}
        icon={icon}
        adornment={
          <animated.span style={adnormentStyles}>
            <KeyboardArrowDownIcon />
          </animated.span>
        }
        contents={contents}
        onClick={onExpand}
      />
      <Box component={animated.ul} overflow="hidden" style={childStyles}>
        {links.map(({ id, ...rest }) => (
          <Link key={id} disabled={!expanded} {...rest} icon={undefined} />
        ))}
      </Box>
    </React.Fragment>
  );
};

type Props = LinkProps | FolderProps;

const MenuItem = (props: Props) => {
  if ((props as FolderProps).links !== undefined) {
    return <Folder {...props as FolderProps} />;
  }
  return <Link {...props} />;
};

export default MenuItem;