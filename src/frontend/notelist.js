import { Note } from './note.js'

class NoteList {

    #element;
    #active_note;
    #content;

    constructor(element, content) {
        this.#element = element;
        this.#active_note = null;
        this.#content = content;
        this.update();
    }

    async update() {
        this.#element.innerHTML = '';

        const notes = await note.list();
        for(const name of notes) {
            await this.add(name);
        }
    }

    get element() {
        return this.#element;
    }

    activate(note) {
        let isPreviewActive = true;
        if (this.#active_note) {
            this.#active_note.deactivate();
            isPreviewActive = this.#active_note.isPreviewActive;
        }

        this.#active_note = note;
        this.#active_note.activate(isPreviewActive);
    }

    async add(name) {
        const text = await note.read(name);
        const new_note = new Note(name, text, this, this.#content);
        if (!this.#active_note) {
            this.activate(new_note);
        }
    }

}

export { NoteList };
