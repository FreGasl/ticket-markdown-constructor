const { exec, execSync } = require('child_process');

function runCommand(command, callback){
    return exec(
        command,
        (
            function() {
                return function(err,data,stderr) {
                    if (!callback)
                        return;

                    callback(err, data, stderr);
                }
            }
        )(callback)
    );
}

function runSync(command){
    try {
        return {
            data: execSync(command).toString(),
            err: null,
            stderr: null
        }
    }
    catch (error) {
        return {
            data: null,
            err: error.stderr.toString(),
            stderr: error.stderr.toString()
        }
    }
}

module.exports = {
    run: runCommand,
    runSync: runSync,
};
