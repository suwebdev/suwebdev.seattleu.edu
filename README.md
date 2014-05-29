# SU WebDev Pages

This is the org pages repository for the Web Development Certificate at Seattle University.

Using this repository
=====================
This repository requires installation of Node.js, along with NPM, Bower, and Grunt. It was created via the Yeoman templating tool.

To bootstrap the site run:

```bash
npm install
bower install
```

To build the site locally run the ``grunt build`` command.


Deploying changes to webdev.seattleu.edu
========================================
Run the following commands:

```
grunt build

grunt buildcontrol
```