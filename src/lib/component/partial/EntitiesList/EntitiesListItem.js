import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Checkbox, TableCell } from "/vendor/@material-ui/core";

import {
  SilenceMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ResourceDetails from "/lib/component/partial/ResourceDetails";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";
import TableSelectableRow from "/lib/component/partial/TableSelectableRow";
import { FloatingTableToolbarCell } from "/lib/component/partial/TableToolbarCell";
import EntityStatusDescriptor from "/lib/component/partial/EntityStatusDescriptor";

import { HoverController } from "/lib/component/controller";

import { CheckStatusIcon } from "/lib/component/base";
import { NamespaceLink } from "/lib/component/util";

class EntitiesListItem extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    entity: PropTypes.object.isRequired,
    hovered: PropTypes.bool.isRequired,
    onHover: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    onChangeSelected: PropTypes.func,
    onClickClearSilence: PropTypes.func,
    onClickSilence: PropTypes.func,
  };

  static defaultProps = {
    selected: undefined,
    onChangeSelected: ev => ev,
    onClickClearSilence: ev => ev,
    onClickSilence: ev => ev,
  };

  static fragments = {
    entity: gql`
      fragment EntitiesListItem_entity on Entity {
        id
        name
        status
        isSilenced
        system {
          platform
          platformVersion
        }
        ...EntityStatusDescriptor_entity
      }

      ${EntityStatusDescriptor.fragments.entity}
    `,
  };

  render() {
    const {
      editable,
      editing,
      entity,
      selected,
      onChangeSelected,
    } = this.props;

    return (
      <HoverController onHover={this.props.onHover}>
        <TableSelectableRow selected={selected}>
          {editable && (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selected}
                onChange={e => onChangeSelected(e.target.checked)}
              />
            </TableCell>
          )}

          <TableOverflowCell>
            <ResourceDetails
              icon={
                <CheckStatusIcon
                  statusCode={entity.status}
                  silenced={entity.isSilenced}
                />
              }
              title={
                <NamespaceLink
                  namespace={entity.namespace}
                  to={`/entities/${entity.name}`}
                >
                  <strong>{entity.name}</strong> {entity.system.platform}{" "}
                  {entity.system.platformVersion}
                </NamespaceLink>
              }
              details={<EntityStatusDescriptor entity={entity} />}
            />
          </TableOverflowCell>

          <FloatingTableToolbarCell
            hovered={this.props.hovered}
            disabled={!editable || editing}
          >
            {() => (
              <ToolbarMenu>
                <ToolbarMenu.Item key="silence" visible="never">
                  <SilenceMenuItem
                    disabled={entity.isSilenced}
                    onClick={this.props.onClickSilence}
                  />
                </ToolbarMenu.Item>
                <ToolbarMenu.Item key="unsilence" visible="never">
                  <UnsilenceMenuItem
                    disabled={!entity.isSilenced}
                    onClick={this.props.onClickClearSilence}
                  />
                </ToolbarMenu.Item>
              </ToolbarMenu>
            )}
          </FloatingTableToolbarCell>
        </TableSelectableRow>
      </HoverController>
    );
  }
}

export default EntitiesListItem;