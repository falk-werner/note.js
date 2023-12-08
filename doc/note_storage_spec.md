# Note storage specification

__Version__: 1

## Motivation

This specification defines how notes are stored in filesystem.

There are two main use cases with major design influence:
- manage notes in filesystem
- store notes in a GIT repository

### Manage Notes in Filesystem

__It should be possible to create, modify and remove notes
in filesystem without additional tool support.__

This requirement states that the storage format of notes
should be intuitive and easy to understand. It is
explicit allowed for a user to manage notes using
regular filesystem operations. It also encourages other
note taking tools to support this specification.

### Store Notes in a GIT Repository

__Notes can be stored in a GIT repository to support
an easy way of version control.__

Since most GIT solutions contain a webserver able to render 
markdown files, this requirement also means that notes
should be rendered correctly, especially when they contain
attachments, e.g. images.

## Note Directory Layout

The following figure shows an example note directory layout.

```
notes                     : base directory
+-- version.txt           : storage layout version (optional)
|
+-- minimal note          : name of the note
|   +-- README.md         : contents of the note
|
+-- note with tags        : name of the note
|   +-- README.md         : contents of the note
|   +-- tags.txt          : tags (optional)
|
+-- note with attachment  : name of the note
    +-- README.md         : contents of the note
    +-- attachment.png    : attachment (optional)
```

### Base Directory

All notes are stored inside a common base directory.
This directory contains an optional version file and a
subdirectory for each note.

#### Version File

```
1
```

The base directory optinally contains a version file named `version.txt`.
This file contains the version of the filesystem layout as single ASCII number.

When the version file is missing, the filesystem layout version is `1`.
Therefore, the version file __must__ be present whenever a filesystem
layer version other than `1` is used.

#### Reserved Files

Since later versions of this specification might place files in the
base directory, some names are reserved and __must not__ be used:
- `style.css` _(might be used to customize visual style)_
- files names starting with `note_`

#### Reserved Subdirectory Names

The base directory contains a subdirectory for each note, where the name
of the subdirectory represents the title of the note.

Later specifications mights use specific subdirectories for other reasons.
To avoid conflicts, subdirectories starting with a period (`.`) are reserved.
Therefore note names __must not__ start with a period.

### Note Subdirectory

The base directory contains a subdirectory for each note, where the name
of the subdirectory represents the title of the note.

#### README.md

Each note subdirectory __must__ contain a file names `README.md` containing
the notes contents.

When the `README.md` file is missing, a tool _should_ assume that the directory
does not contain a note.

#### Tags

```
some tag
another tag
```

Optionally, a note can be tagged. Therefore, the note directory can contain
a file named `tags.txt`. Each line in the file is considered a single tag.
Empty lines _should_ be ignored.

A note without a `tags.txt` file is considered to be not tagged.
A note with an empty `tags.txt` file also considered to be not tagged.

#### Attachments

Any other file in the note subdirectory is considered to be an attachments.
This allows to reference attachments easily by it's filename in `README.md`.
