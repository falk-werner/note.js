const { Config } = require("./config");

const path = require("path");
const fs = require("fs");
const { readFile } = require("node:fs/promises");

const config = new Config();

function get_note_file(name) {
    return path.join(config.note_path, name, "README.md");
}

module.exports.list = async function() {
    const files = fs.readdirSync(config.note_path);
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

module.exports.create = async function() {
    let id = 0;
    let name = "Untitled";
    let note_path = path.join(config.note_path, name);
    while (fs.existsSync(note_path)) {
        id++;
        name = `Untitled ${id}`;
        note_path = path.join(config.note_path, name)
    }

    fs.mkdirSync(note_path);
    const readme = path.join(note_path, "README.md");
    fs.writeFileSync(readme, `# ${name}`, { encoding: 'utf-8'});

    return name;
};

module.exports.rename = async function(_, old_name, new_name) {
    const old_path = path.join(config.note_path, old_name);
    const new_path = path.join(config.note_path, new_name);

    fs.renameSync(old_path, new_path);
}

module.exports.write = async function(_, name, contents) {
    const readme = path.join(config.note_path, name, "README.md");
    fs.writeFileSync(readme, contents, { encoding: 'utf-8'});
}

module.exports.remove = async function(_, name) {
    note_path = path.join(config.note_path, name);
    fs.rmSync(note_path, {force: true, recursive: true});
}
