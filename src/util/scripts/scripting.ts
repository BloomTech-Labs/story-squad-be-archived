// Might remove this library
import { PythonShell } from 'python-shell';

import { Scripts } from '../../models/internal/DS';

/**
 * @description This function is designed to be setup to run Python Scripts from
 * Node, it uses the `Scripts` model to determine which scripts are valid and what
 * their inputs and outputs are.
 *
 * To use this function first make sure the script you which to use is detailed in
 * the `Scripts` model with the path and input and output paths, and that the python
 * script exist in relative path to the root dir, then call this function and provide
 * the params of the `scriptPath`, `inputData` and `findResult()`. The Python script
 * will then be setup in an async child process and the result will be returned in a
 * promise which you can use `await` or `.then()` to work with.
 *
 * Note: Be careful with your input and output data types! These are only to help with VS Tooling
 * and are not checked at run time, so test your code and make sure that the Python script
 * takes in teh data you are expecting.
 *
 * @example
 * ```ts
 * function transcribe(data: Transcribable) {
 *   return runScript('./ds/transcription.py', data, (out) =>
 *     out.map(attemptJSONParse).find(onlyTranscription)
 *   );
 * }
 * ```
 *
 * @param {keyof Scripts} scriptPath The relative path from root to the script to run
 * @param {Scripts[typeof script]['input']} inputData input data to the script matching
 * the dataType defined in the `Scripts` interface
 * @param {(out: string[]) => Scripts[typeof script]['output']} findResults a callback
 * function that will go through the array of all outputs of the stdout outputs of the
 * script and find the result value.
 *
 * Note: Some Scripts may stdout when printing out status messages
 * @returns {Promise<ReturnType<typeof findResults>>} A promise of the resulting data
 * after being found with the `findResult()` callback
 */
export const runScript = (
    scriptPath: keyof Scripts, // Matches a key of the `Scripts` interface which is a path to the script being used
    inputData: Scripts[typeof scriptPath]['input'], // Uses the `input` type for the selected Script
    findResults: (out: string[]) => Scripts[typeof scriptPath]['output'] // Uses the output data type of the selected Script
): Promise<ReturnType<typeof findResults>> => {
    const shell = new PythonShell(scriptPath, { stdio: 'pipe' }); // Starts script in the background and opens up stdin for piping data
    return new Promise((resolve, reject) => {
        // Creates a new promise for the result, since the script is async a promise makes most since
        shell.stdin.write(JSON.stringify(inputData)); // Writes the data to stdin
        shell.stdin.end(); // Closes stdin to the script can start

        let out: string[] = []; // An array of all the terminal outputs
        shell.stderr.on('error', (...err) => reject(...err)); // Rejects the promise if an error is thrown in the script
        shell.stdout.on('data', (...data) => (out = [...out, ...data])); // Adds every stdout (including `print()` calls) to the out array
        shell.stdout.on('close', () => resolve(findResults(out))); // Resolves the promise by calling the `findResult()` callback function
    });
};
