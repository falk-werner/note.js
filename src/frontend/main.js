import { slider_attach } from "./slider.js"
import { NoteList } from "./notelist.js"

const main = function() {
    slider_attach(document.querySelector("#slider"));
    const editor = new SimpleMDE({
        element: document.querySelector('#editor'),
        autoDownloadFontAwesome: false
    });

    const notelist = new NoteList(document.querySelector('#notelist'), editor);

    document.querySelector('#add').addEventListener('click', async () => {
        const name = await note.create();
        notelist.add(name);
    }, false);

    document.querySelector('#update').addEventListener('click', async () => {
        notelist.update();
    });

};

addEventListener("DOMContentLoaded", main);
