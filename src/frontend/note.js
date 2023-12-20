
import { render } from './markdown_renderer.js'

class Note {

    #name;
    #list_item;
    #editor_element;
    #editor;
    #link;
    #toggleEdit;
    #toolbar;
    #tags_container;
    #tags;

    constructor(name, text, tags, notelist, content) {
        this.#name = name;
        
        this.#create_listentry(notelist);
        this.#create_editor(notelist, content, text, tags);
    }

    #create_listentry(notelist) {
        this.#list_item = document.createElement('li');
        notelist.element.appendChild(this.#list_item);

        this.#link = document.createElement('a');
        this.#list_item.appendChild(this.#link);
        this.#link.textContent = this.#name;
        this.#link.href = '#';
        this.#link.addEventListener('click', async() => {
            notelist.activate(this);
        }, false);

        this.#toggleEdit = document.createElement('a');
        this.#list_item.appendChild(this.#toggleEdit);
        this.#toggleEdit.href = '#';
        this.#toggleEdit.className = 'toggle-edit fa fa-pencil hidden';
        this.#toggleEdit.textContent = '';
        this.#toggleEdit.addEventListener('click', () => {
            this.#toggleEditMode(notelist);
        }, false);

    }

    #toggleEditMode(notelist) {
        if (this.#toggleEdit.classList.contains('fa-pencil')) {
            this.#toggleEdit.classList.replace('fa-pencil', 'fa-floppy-o');
        }
        else {
            notelist.save(this, this.#editor.value());
            this.#toggleEdit.classList.replace('fa-floppy-o', 'fa-pencil');
        }

        this.#toolbar.classList.toggle('hidden');
        this.#tags_container.classList.toggle('hidden');
        this.#editor.togglePreview(notelist);
    }

    #create_editor(notelist, content, text, tags) {
        this.#editor_element = document.createElement('div');
        content.appendChild(this.#editor_element);

        this.#tags_container = document.createElement('div');
        this.#editor_element.appendChild(this.#tags_container);
        this.#tags_container.classList.add('tags')

        const tags_caption = document.createElement('span');
        this.#tags_container.appendChild(tags_caption);
        tags_caption.className = "fa fa-tags";

        this.#tags = document.createElement('input');
        this.#tags_container.appendChild(this.#tags);
        this.#tags.value = tags.join(' ');

        const textarea = document.createElement('textarea');
        this.#editor_element.appendChild(textarea);
        this.#editor = new SimpleMDE({
            element: textarea,
            autoDownloadFontAwesome: false,
            previewRender: (plainText) => { return render(this.#name, plainText); },
            toolbar: [{
                name: "side-by-side",
                action: SimpleMDE.toggleSideBySide,
                className: "fa fa-columns no-disable no-mobile",
                title: "Toggle Side by Side"
            }, {
                name: "fullscreen",
                action: SimpleMDE.toggleFullScreen,
                className: "fa fa-arrows-alt no-disable no-mobile",
                title: "Toggle FullScreen"
            }, "|", {
                name: "bold",
                action: SimpleMDE.toggleBold,
                className: "fa fa-bold no-disable",
                title: "Bold"
            }, {
                name: "italic",
                action: SimpleMDE.toggleItalic,
                className: "fa fa-italic",
                title: "Italic"
            }, {
                name: "heading",
                action: SimpleMDE.toggleHeadingSmaller,
                className: "fa fa-header",
                title: "Heading"
            }, "|", {
                name: "code",
                action: SimpleMDE.toggleCodeBlock,
                className: "fa fa-code",
                title: "Code"
            }, {
                name: "quote",
                action: SimpleMDE.toggleBlockquote,
                className: "fa fa-quote-left",
                title: "Quote"
            }, {
                name: "unordered-list",
                action: SimpleMDE.toggleUnorderedList,
                className: "fa fa-list-ul",
                title: "Generic List"
            }, {
                name: "ordered-list",
                action: SimpleMDE.toggleOrderedList,
                className: "fa fa-list-ol",
                title: "Numbered List"
            },
            "|", {
                name: "link",
                action: SimpleMDE.drawLink,
                className: "fa fa-link",
                title: "Create Link"                    
            }, {
                name: "image",
                action: SimpleMDE.drawImage,
                className: "fa fa-picture-o",
                title: "Insert Image"
            }, {
                name: "table",
                action: SimpleMDE.drawTable,
                className: "fa fa-table",
                title: "Insert Table"
            }, "|", {
                name: "save",
                action: () => { 
                    notelist.save(this, this.#editor.value());
                },
                className: "fa fa-floppy-o",
                title: "Save Note"
            }, {
                name: "remove",
                action: () => { 
                    notelist.remove(this); 
                },
                className: "fa fa-trash no-disable",
                title: "Delete Note"
            }]
        });

        this.#editor.value(text);
        this.#editor.togglePreview();

        this.#toolbar = this.#editor_element.querySelector(".editor-toolbar");
        this.#toolbar.classList.add('hidden');
        this.#tags_container.classList.add('hidden');

        this.#hide();
    }

    get isPreviewActive() {
        return this.#editor.isPreviewActive();
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get tags() {
        return this.#tags.value.split(' ');
    }

    activate(previewActive) {
        this.#link.classList.add('active');
        this.#toggleEdit.classList.remove('hidden');

        if (previewActive != this.#editor.isPreviewActive()) {
            this.#editor.togglePreview();
        }
        this.#show();
    }

    remove() {
        this.#list_item.remove();
        this.#editor_element.remove();
    }

    deactivate() {
        this.#link.classList.remove('active');
        this.#toggleEdit.classList.add('hidden');
        this.#hide();
    }

    #show() {
        this.#editor_element.classList.remove('hidden');
    }

    #hide() {
        this.#editor_element.classList.add('hidden');
    }

    #filter_by_tag(tags) {
        if (tags.length == 0) { return true; }

        for (const tag of this.tags) {
            if (tags.includes(tag)) {
                return true;
            }
        }

        return false;
    }

    filter(value, tags) {

        if (this.#filter_by_tag(tags) && 
            ((this.#name.toLowerCase().includes(value.toLowerCase())) || (
            this.#editor.value().toLowerCase().includes(value.toLowerCase())))) {
            this.#list_item.classList.remove('hidden');
        }
        else {
            this.#list_item.classList.add('hidden');
        }
    }

}


export { Note }
