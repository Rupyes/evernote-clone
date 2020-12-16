import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import { removeHTMLTags } from '../helpers';
import React, { Component } from 'react';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { ListItemAvatar, ListItemIcon } from '@material-ui/core';

class SidebarItemComponent extends Component {
  render() {
    const { _note, classes, selectedNoteId } = this.props;
    return _note ? (
      <div key={_note.id}>
        <ListItem
          className={classes.listItem}
          selected={selectedNoteId === _note.id}
          alignItems='flex-start'
        >
          <ListItemAvatar>
            <ListItemIcon className='drag-handle'>
              <DragHandleIcon />
            </ListItemIcon>
          </ListItemAvatar>
          <div
            className={classes.textSection}
            onClick={() => this.selectNote(_note)}
          >
            <ListItemText
              primary={_note.title + '->' + _note.orderId}
              secondary={removeHTMLTags(_note.body.substring(0, 30)) + '....'}
            ></ListItemText>
          </div>

          <DeleteIcon
            onClick={() => {
              this.deleteNote(_note);
            }}
            className={classes.deleteIcon}
          ></DeleteIcon>
        </ListItem>
      </div>
    ) : (
      <p>Create a note!</p>
    );
  }
  selectNote = (n) => {
    this.props.selectNote(n);
  };
  deleteNote = (n) => {
    if (window.confirm(`Do you really want to delete: ${n.title}?`)) {
      this.props.deleteNote(n);
    }
  };
}

export default withStyles(styles)(SidebarItemComponent);
