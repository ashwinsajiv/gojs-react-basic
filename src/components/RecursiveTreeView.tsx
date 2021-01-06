import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Typography from "@material-ui/core/Typography";

import _ from 'lodash'

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:hover > $content": {
      backgroundColor: theme.palette.action.hover
    },
    "&:focus > $content, &$selected > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)"
    },
    "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
      backgroundColor: "transparent"
    }
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2)
    }
  },
  label: {
    fontWeight: "inherit",
    color: "inherit"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  }
}));

export function RecursiveTreeView(props) {
  const classes = useStyles();
  const [isShown, setIsShown] = useState(false);
  const renderTree = (nodes) => (
    <TreeItem key={nodes.key} nodeId={nodes.key} 
    label={
      <div className={classes.labelRoot}>
        <Typography variant="body2" className={classes.labelText}>
          {nodes.label}
        </Typography>
        <VisibilityIcon color="inherit" className={classes.labelIcon} onClick={() => props.onVisibilityChange(nodes.key)}/>
      </div>
      }
    classes={{
        root: classes.root,
        content: classes.content,
        group: classes.group,
        label: classes.label
      }}>
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
