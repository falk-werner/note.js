import { Note } from './note.js'

function get_name(text, default_value) {
    const lines = text.split("\n");
    for(const line of lines) {
        if(line.startsWith("#")) {
            const name = line.replaceAll(/[#<>:\\\/\|\?\*]/g, "").trim();
            return name;
        }
    }

    return default_value;
}

class NoteList {

    #element;
    #active_note;
    #content;
    #notes;
    #change_listeners;

    constructor(element, content) {
        this.#element = element;
        this.#active_note = null;
        this.#content = content;
        this.#change_listeners = [];
        this.update();
    }

    async update() {
        this.#element.innerHTML = '';
        this.#notes = {};

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
        const tags = await note.read_tags(name);
        const new_note = new Note(name, text, tags, this, this.#content);
        this.#notes[name] = new_note;
        if (!this.#active_note) {
            this.activate(new_note);
        }

        this.#fire_change();
    }

    async save(item, text) {
        const new_name = get_name(text, item.name);
        if (new_name != item.name) {
            await note.rename(item.name, new_name);
            item.name = new_name;
            this.update();
        }
        note.write(item.name, text);
        note.write_tags(item.name, item.tags);

        this.#fire_change();
    }

    async remove(item) {
        await note.remove(item.name);
        delete this.#notes[item.name];
        item.remove();

        if (this.#active_note == item) {
            this.#active_note = null;            
            const keys = Object.keys(this.#notes);
            if (keys.length > 0) {
                this.activate(this.#notes[keys[0]]);
            }    
        }

        this.#fire_change();
    }

    filter(value, tags) {
        for(let note of Object.values(this.#notes)) {
            note.filter(value, tags);
        }
    }

    add_change_listener(listener) {
        this.#change_listeners.push(listener);
    }

    #fire_change() {
        for(let listener of this.#change_listeners) {
            listener();
        }
    }
}

export { NoteList };
