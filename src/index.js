const semver = require('semver');
const path = require('path');
const Folders = require('./folders');
const File = require('./file');

class SemverReleaseScripts {
    /**
     * 
     * @param {object} config 
     */
    constructor(config) {
        this.source = config.source;
        this.verbose = config.verbose;
        this.folders = new Folders(this.source, this.verbose);
    }

    /**
     * 
     * @param {string} method
     * @param {string} to 
     * @param {object} options
     */
    run(method, to, options) {
        if (!to) {
            throw new Error('to not defined in SemverReleaseScripts.run');
        }

        if (!semver.valid(to)) {
            throw new Error('to is not a valid semver in SemverReleaseScripts.run');
        }

        return this.folders.get()
            .then(folders => {
                const toFolder = folders.find(folder => semver.eq(folder, to));
                if (!toFolder) {
                    throw new Error(`Upgrade folder for ${to} does not exist`);
                }

                const file = new File(path.resolve(this.source, toFolder), to, options);

                return file[method]();
            });
    }
};

module.exports = SemverReleaseScripts;