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

    #provider;
    #element;
    #active_note;
    #content;
    #notes;
    #change_listeners;

    constructor(provider, element, content) {
        this.#provider = provider;
        this.#element = element;
        this.#active_note = null;
        this.#content = content;
        this.#change_listeners = [];
        this.update();
    }

    async update() {
        this.#element.innerHTML = '';
        this.#notes = {};

        const notes = await this.#provider.list();
        for(const name of notes) {
            await this.#add(name);
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

    async add_new() {
        const name = await this.#provider.create();
        this.#add(name);
    }

    async #add(name) {
        const text = await this.#provider.read(name);
        const tags = await this.#provider.read_tags(name);
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
            await this.#provider.rename(item.name, new_name);
            item.name = new_name;
            this.update();
        }
        this.#provider.write(item.name, text);
        this.#provider.write_tags(item.name, item.tags);

        this.#fire_change();
    }

    async remove(item) {
        await this.#provider.remove(item.name);
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
