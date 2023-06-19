import { slider_attach } from "./slider.js"
import { NoteList } from "./notelist.js"

const main = function() {
    slider_attach(document.querySelector("#slider"));

    const notelist = new NoteList(
        document.querySelector('#notelist'), 
        document.querySelector('#content'));

    document.querySelector('#add').addEventListener('click', async () => {
        const name = await note.create();
        notelist.add(name);
    }, false);

};

addEventListener("DOMContentLoaded", main);
