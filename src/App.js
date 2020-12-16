import React from 'react';
import './App.css';
import firebase from 'firebase';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedNoteId: null,
      selectedNote: null,
      notes: null,
    };
  }
  render() {
    return (
      <div className='app-containter'>
        <SidebarComponent
          notes={this.state.notes}
          selectedNoteId={this.state.selectedNoteId}
          deleteNote={this.deleteNote}
          selectNote={this.selectNote}
          newNote={this.newNote}
          updateOrderId={this.updateOrderId}
        ></SidebarComponent>
        {this.state.selectedNote ? (
          <EditorComponent
            selectedNote={this.state.selectedNote}
            selectedNoteId={this.selectedNoteId}
            notes={this.state.notes}
            noteUpdate={this.noteUpdate}
          ></EditorComponent>
        ) : null}
      </div>
    );
  }

  noteUpdate = (id, noteObj) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        orderId: Number(noteObj.orderId),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  updateOrderId = (movedNote, removedIndex, addedIndex, newOrderId) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(movedNote.id)
      .update({
        title: movedNote.title,
        body: movedNote.body,
        orderId: Number(newOrderId),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };

  newNote = async (title) => {
    const note = {
      title,
      body: '',
      orderId:
        this.state.notes && this.state.notes.length >= 1
          ? this.state.notes[this.state.notes.length - 1]['orderId'] + 1.0
          : 0,
    };
    const newFromDB = await firebase.firestore().collection('notes').add({
      title: note.title,
      body: note.body,
      orderId: note.orderId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    const newId = newFromDB.id;

    await this.setState({ notes: [...this.state.notes, note] });

    const newNoteIndex = this.state.notes.indexOf(
      this.state.notes.filter((_note) => _note.id === newId)[0]
    );

    this.setState({
      selectedNote: this.state.notes[newNoteIndex],
      selectedNoteId: newId,
    });
  };

  deleteNote = async (note) => {
    if (this.state.selectedNoteId === note.id) {
      this.setState({ selectedNoteId: null, selectedNote: null });
    }

    await this.setState({
      notes: this.state.notes.filter((_note) => _note !== note),
    });

    firebase.firestore().collection('notes').doc(note.id).delete();
  };

  selectNote = (note) => {
    this.setState({
      selectedNoteId: note.id,
      selectedNote: note,
    });
  };

  componentDidMount = () => {
    firebase
      .firestore()
      .collection('notes')
      .orderBy('orderId')
      .onSnapshot((serverUpdate) => {
        const notes = serverUpdate.docs.map((_doc) => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        this.setState({ notes: notes });
      });
  };
}

export default App;
