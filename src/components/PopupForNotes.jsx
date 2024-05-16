import React, { useState, useRef } from 'react';
import { getDatabase, ref, push, remove } from 'firebase/database';
import './PopupForNotes.css';

function PopupForNotes(props) {
    const inputFileRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNotePara, setNewNotePara] = useState('');
    const database = getDatabase();

    const triggerFileInputClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleFileChange = () => {
        const files = inputFileRef.current.files;
        const names = [...files].map(file => file.name).join(", ");
        setFileName(names);
    };

    const handleSave = () => {
        if (!newNoteTitle.trim() || !newNotePara.trim()) {
            alert("Please enter both title and content.");
            return;
        }
        const newNote = {
            title: newNoteTitle,
            content: newNotePara,
            files: fileName,
            date: new Date().toLocaleString()
        };

        const notesRef = ref(database, 'notes');
        push(notesRef, newNote).then(() => {
            setNewNoteTitle('');
            setNewNotePara('');
            setFileName('');
            props.closePopup();
        }).catch(error => {
            console.error("Error adding note: ", error);
        });
    };

    const handleDelete = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const noteRef = ref(database, `notes/${noteId}`);
            remove(noteRef)
                .then(() => {
                    console.log("Note deleted successfully");
                })
                .catch((error) => {
                    console.error("Error deleting note: ", error);
                });
        }
    };

    return (
        <>
            <textarea
                name="newNoteTitle"
                placeholder="Title"
                id="newNoteTitle"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
            ></textarea>
            <textarea
                name="newNotePara"
                placeholder="Type something here..."
                id="newNotePara"
                value={newNotePara}
                onChange={(e) => setNewNotePara(e.target.value)}
            ></textarea>
            <div className="newNoteDropFile" onClick={triggerFileInputClick}>
                <label htmlFor="input-file">
                    <div id="img-view">
                        <input type="file" ref={inputFileRef} onChange={handleFileChange} hidden multiple />
                        <img src="" alt="" />
                        <span>{fileName || 'DropFile'}</span>
                    </div>
                </label>
            </div>
            <div className="home_saveBtn" onClick={handleSave}>Save</div>
            <div className="home_deleteBtn" onClick={() => handleDelete(props.noteId)}>Delete</div>
        </>
    )
}

export default PopupForNotes;
