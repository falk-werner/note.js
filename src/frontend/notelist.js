class NoteList {

    constructor(element, editor) {
        this.element = element;
        this.active_item = null;
        this.editor = editor;
        this.update();
    }

    async update() {
        this.element.innerHTML = '';

        const notes = await note.list();
        for(const note of notes) {
            this.add(note);
        }
    }

    add(name) {
        const item = document.createElement('li');
        this.element.appendChild(item);

        const link = document.createElement('a');
        item.appendChild(link);
        link.textContent = name;
        link.href = '#';
        link.addEventListener('click', async() => {
            const content = await note.read(name);
            this.editor.value(content);
            if (this.active_item !== null) {
                this.active_item.classList.remove('active');
            }
            this.active_item = link;
            this.active_item.classList.add('active');
        }, false);

    }

}

export { NoteList };
