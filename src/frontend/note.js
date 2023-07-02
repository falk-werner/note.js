
class Note {

    #name;
    #list_item;
    #editor_element;
    #editor;
    #link;

    constructor(name, text, notelist, content) {
        this.#name = name;
        
        this.#create_listentry(notelist);
        this.#create_editor(notelist, content, text);
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
    }


    #create_editor(notelist, content, text) {
        this.#editor_element = document.createElement('div');
        content.appendChild(this.#editor_element);

        const textarea = document.createElement('textarea');
        this.#editor_element.appendChild(textarea);
        this.#editor = new SimpleMDE({
            element: textarea,
            autoDownloadFontAwesome: false,
            toolbar: [{
                name: "preview",
                action: SimpleMDE.togglePreview,
                className: "fa fa-eye no-disable",
                title: "Toggle Preview"
            }, {
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
                className: "fa fa-bold",
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
                className: "fa fa-trash no-disable",
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
        this.#hide();
    }

    get isPreviewActive() {
        return this.#editor.isPreviewActive();
    }

    get name() {
        return this.#name;
    }

    activate(previewActive) {
        this.#link.classList.add('active');

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
