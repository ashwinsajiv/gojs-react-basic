import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import _ from 'lodash'

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
    <TreeItem key={nodes.key} nodeId={nodes.key} label={nodes.label} endIcon={<VisibilityIcon onClick={() => props.onVisibilityChange(nodes.key)}/>}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </TreeItem>
  );

  const updateData = (d) => {
    var groupedByParents = _.groupBy(d, 'group');
    var catsById = _.keyBy(d, 'key');
    _.each(_.omit(groupedByParents, undefined), function(children, parentId) {
      catsById[parentId].children = children; 
    });
    _.each(catsById, function(cat) {
      // _.compact below is just for removing null posts
      cat.children = _.compact(_.union(cat.children, cat.posts));
      // optionally, you can also delete cat.posts here.
  });
    return groupedByParents[undefined][0]
  }

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(updateData(JSON.parse(JSON.stringify(props.nodeDataArray))))}
    </TreeView>
  );
}
