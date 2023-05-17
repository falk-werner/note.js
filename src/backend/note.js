const os = require("os");
const path = require("path");
const fs = require("fs");
const { readFile } = require("node:fs/promises");

const homedir = os.homedir();
const note_path = path.join(homedir, ".notepy","notes");

function get_note_file(name) {
    return path.join(note_path, name, "README.md");
}

module.exports.list = async function() {
    const files = fs.readdirSync(note_path);
    const notes = [];

    for(let file of files) {
        const note = get_note_file(file);
        const stat = fs.statSync(note);
        if (stat.isFile()) {
            notes.push(file);
        }
    }

    return notes;
};

module.exports.read = async function(_, name) {
    const note = get_note_file(name);
    const contents = await readFile(note, { encoding: 'utf8' });

    return contents;
};
