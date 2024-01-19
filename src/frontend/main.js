import { slider_attach } from "./slider.js"
import { NoteList } from "./notelist.js"
import { TagList } from "./taglist.js"

const main = function() {
    slider_attach(document.querySelector("#slider"));

    const notelist = new NoteList(
        NodeNoteProvider,
        document.querySelector('#notelist'), 
        document.querySelector('#content'));

    const taglist = new TagList(
        NodeNoteProvider,
        document.querySelector('#taglist'),
        () => {
            const filter = document.querySelector('#filter').value;
            notelist.filter(filter, taglist.active_tags);    
    });
    
    notelist.add_change_listener(() => {
        taglist.update();
    });

    document.querySelector('#add').addEventListener('click', async () => {
        notelist.add_new();
    }, false);

    document.querySelector("#filter").addEventListener('input', () => {
        const filter = document.querySelector('#filter').value;
        notelist.filter(filter, taglist.active_tags);
    });

};

addEventListener("DOMContentLoaded", main);
