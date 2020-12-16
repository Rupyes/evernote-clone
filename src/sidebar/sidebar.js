import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import List from '@material-ui/core/List';
import { Divider, Button } from '@material-ui/core';
import SidebarItemComponent from '../sidebaritem/sidebarItem';
import { Container, Draggable } from 'react-smooth-dnd';

class SidebarComponent extends Component {
  constructor() {
    super();
    this.state = {
      addingNote: false,
      title: null,
    };
  }

  render() {
    const { notes, classes, selectedNoteId } = this.props;
    if (notes) {
      return (
        <div className={classes.sidebarContainer}>
          <Button onClick={this.newNoteBtnClick} className={classes.newNoteBtn}>
            {this.state.addingNote ? 'Cancel' : 'New Note'}
          </Button>
          {this.state.addingNote ? (
            <div>
              <input
                type='text'
                className={classes.newNoteInput}
                placeholder='Enter Note title'
                onKeyUp={(e) => this.updateTitle(e.target.value)}
              />
              <Button
                className={classes.newNoteSubmitBtn}
                onClick={this.newNote}
              >
                Submit Note
              </Button>
            </div>
          ) : null}
          <List>
            <Container
              dragHandleSelector='.drag-handle'
              lockAxis='y'
              onDrop={this.onDrop}
            >
              {notes.map((_note) => {
                return (
                  <Draggable key={_note.id}>
                    <SidebarItemComponent
                      _note={_note}
                      selectedNoteId={selectedNoteId}
                      selectNote={this.selectNote}
                      deleteNote={this.deleteNote}
                    ></SidebarItemComponent>
                    <Divider></Divider>
                  </Draggable>
                );
              })}
            </Container>
          </List>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  onDrop = ({ removedIndex, addedIndex }) => {
    if (removedIndex !== addedIndex) {
      const DIFF = 0.0001;
      const movedNote = this.props.notes[removedIndex];
      const addedIndexOrderId = this.props.notes[addedIndex]['orderId'];
      let newOrderId = 0;
      if (addedIndex === 0) {
        newOrderId = addedIndexOrderId - DIFF;
      } else if (addedIndex === this.props.notes.length - 1) {
        newOrderId = addedIndexOrderId + DIFF;
      } else {
        if (removedIndex > addedIndex) {
          const aboveAddedIndexOrderId = this.props.notes[addedIndex - 1][
            'orderId'
          ];
          newOrderId = (addedIndexOrderId + aboveAddedIndexOrderId) / 2;
        } else {
          const aboveAddedIndexOrderId = this.props.notes[addedIndex + 1][
            'orderId'
          ];
          newOrderId = (addedIndexOrderId + aboveAddedIndexOrderId) / 2;
        }
      }
      this.props.updateOrderId(movedNote, removedIndex, addedIndex, newOrderId);
    }
  };

  newNoteBtnClick = () => {
    this.setState({ title: null, addingNote: !this.state.addingNote });
  };

  updateTitle = (text) => {
    this.setState({ title: text });
  };

  newNote = () => {
    this.props.newNote(this.state.title);
    this.setState({ title: null, addingNote: false });
  };

  selectNote = (note) => {
    this.props.selectNote(note);
  };

  deleteNote = (note) => {
    this.props.deleteNote(note);
  };
}

export default withStyles(styles)(SidebarComponent);
