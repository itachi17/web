import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { useBreakpoint } from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import Drawer from "/lib/component/partial/Drawer";
import AppBar from "/lib/component/partial/AppBar";

const AppLayout = ({ namespace: namespaceProp, loading, fullWidth, children }) => {
  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  // TODO: Query data from cache
  const namespace = namespaceProp ? { name: namespaceProp } : null;

  return (
    <Loader loading={loading}>
      <BaseAppLayout
        fullWidth={fullWidth}
        mobile={isSmViewport}
        topBar={
          isSmViewport && (
            <AppBar loading={loading} namespace={namespace} />
          )
        }
        drawer={
          !isSmViewport && (
            <Drawer
              variant={isLgViewport ? "large" : "small"}
              loading={loading}
              namespace={namespace}
            />
          )
        }
        content={children}
      />
    </Loader>
  );
};

AppLayout.fragments = {
  namespace: gql`
    fragment AppLayout_namespace on Namespace {
      id
      ...AppBar_namespace
      ...Drawer_namespace
    }

    ${AppBar.fragments.namespace}
    ${Drawer.fragments.namespace}
  `,
};

AppLayout.propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  namespace: PropTypes.string,
};

AppLayout.defaultProps = {
  fullWidth: false,
  children: undefined,
  loading: false,
  namespace: null,
};

export default AppLayout;
