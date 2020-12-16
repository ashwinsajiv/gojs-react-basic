import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import App from '../App';

const data = {
  id: 'A',
  name: 'A',
  children: [
    {
      id: 'AF',
      name: 'F',
      children: [
        {
          id: 'AFT',
          name: 'T',
        },
        {
          id: 'AFA',
          name: 'A',
          children: [
            {
              id: 'AFAS',
              name: 'S'
            }
          ],
        },
        {
          id: 'AFTr',
          name: 'Tr',
          children: [
            {
              id: 'AFTrS',
              name: 'S',
            }
          ],
        },
        {
          id: 'AFC',
          name: 'C',
          children: [
            {
              id: 'AFCS',
              name: 'S'
            },
          ],
        },
        {
          id: 'AFE',
          name: 'E',
          children: [
            {
              id: 'AFES',
              name: 'S'
            },
            {
              id: 'AFEG',
              name: 'GCS'
            }
          ],
        },
      ],
    },
  ],
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export function RecursiveTreeView(props) {
  const classes = useStyles();

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name} endIcon={<VisibilityIcon onClick={() => props.onVisibilityChange(nodes.id)}/>}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}
