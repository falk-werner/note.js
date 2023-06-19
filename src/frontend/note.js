
class Note {

    #name;
    #editor_element;
    #editor;
    #link;

    constructor(name, text, notelist, content) {
        this.#name = name;
        
        this.#create_listentry(notelist);
        this.#create_editor(content, text);
    }

    #create_listentry(notelist) {
        const item = document.createElement('li');
        notelist.element.appendChild(item);

        this.#link = document.createElement('a');
        item.appendChild(this.#link);
        this.#link.textContent = this.#name;
        this.#link.href = '#';
        this.#link.addEventListener('click', async() => {
            notelist.activate(this);
        }, false);
    }


    #create_editor(content, text) {
        this.#editor_element = document.createElement('div');
        content.appendChild(this.#editor_element);

        const textarea = document.createElement('textarea');
        this.#editor_element.appendChild(textarea);
        this.#editor = new SimpleMDE({
            element: textarea,
            autoDownloadFontAwesome: false
        });

        this.#editor.value(text);
        this.#editor.togglePreview();
        this.#hide();
    }

    get isPreviewActive() {
        return this.#editor.isPreviewActive();
    }

    activate(previewActive) {
        this.#link.classList.add('active');

        if (previewActive != this.#editor.isPreviewActive()) {
            this.#editor.togglePreview();
        }
        this.#show();
    }

    deactivate() {
        this.#link.classList.remove('active');
        this.#hide();
    }

    #show() {
        this.#editor_element.classList.remove('hidden');
    }

    #hide() {
        this.#editor_element.classList.add('hidden');
    }

}


export { Note }
