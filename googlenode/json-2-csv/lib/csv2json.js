'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Csv2Json = void 0;
const doc_path_1 = require("doc-path");
const constants_1 = require("./constants");
const utils = __importStar(require("./utils"));
const Csv2Json = function (options) {
    const escapedWrapDelimiterRegex = new RegExp(options.delimiter.wrap + options.delimiter.wrap, 'g'), excelBOMRegex = new RegExp('^' + constants_1.excelBOM), valueParserFn = options.parseValue && typeof options.parseValue === 'function' ? options.parseValue : JSON.parse;
    /**
     * Trims the header key, if specified by the user via the provided options
     */
    function processHeaderKey(headerKey) {
        headerKey = removeWrapDelimitersFromValue(headerKey);
        if (options.trimHeaderFields) {
            return headerKey.split('.')
                .map((component) => component.trim())
                .join('.');
        }
        return headerKey;
    }
    /**
     * Generate the JSON heading from the CSV
     */
    function retrieveHeading(lines) {
        let headerFields = [];
        if (options.headerFields) {
            headerFields = options.headerFields.map((headerField, index) => ({
                value: processHeaderKey(headerField),
                index
            }));
        }
        else {
            // Generate and return the heading keys
            const headerRow = lines[0];
            headerFields = headerRow.map((headerKey, index) => ({
                value: processHeaderKey(headerKey),
                index
            }));
            // If the user provided keys, filter the generated keys to just the user provided keys so we also have the key index
            if (options.keys) {
                const keys = options.keys; // TypeScript type checking work around to get it to recognize the option is not undefined
                headerFields = headerFields.filter((headerKey) => keys.includes(headerKey.value));
            }
        }
        return {
            lines,
            headerFields,
            recordLines: [],
        };
    }
    /**
     * Removes the Excel BOM value, if specified by the options object
     */
    function stripExcelBOM(csv) {
        if (options.excelBOM) {
            return csv.replace(excelBOMRegex, '');
        }
        return csv;
    }
    /**
     * Helper function that splits a line so that we can handle wrapped fields
     */
    function splitLines(csv) {
        // Parse out the line...
        const lines = [], lastCharacterIndex = csv.length - 1, eolDelimiterLength = options.delimiter.eol.length, stateVariables = {
            insideWrapDelimiter: false,
            parsingValue: true,
            justParsedDoubleQuote: false,
            startIndex: 0
        };
        let splitLine = [], character, charBefore, charAfter, nextNChar, index = 0;
        // Loop through each character in the line to identify where to split the values
        while (index < csv.length) {
            // Current character
            character = csv[index];
            // Previous character
            charBefore = index ? csv[index - 1] : '';
            // Next character
            charAfter = index < lastCharacterIndex ? csv[index + 1] : '';
            // Next n characters, including the current character, where n = length(EOL delimiter)
            // This allows for the checking of an EOL delimiter when if it is more than a single character (eg. '\r\n')
            nextNChar = utils.getNCharacters(csv, index, eolDelimiterLength);
            if ((nextNChar === options.delimiter.eol && !stateVariables.insideWrapDelimiter ||
                index === lastCharacterIndex) && charBefore === options.delimiter.field) {
                // If we reached an EOL delimiter or the end of the csv and the previous character is a field delimiter...
                // If the start index is the current index (and since the previous character is a comma),
                //   then the value being parsed is an empty value accordingly, add an empty string
                if (nextNChar === options.delimiter.eol && stateVariables.startIndex === index) {
                    splitLine.push('');
                }
                else if (character === options.delimiter.field) {
                    // If we reached the end of the CSV, there's no new line, and the current character is a comma
                    // then add an empty string for the current value
                    splitLine.push('');
                }
                else {
                    // Otherwise, there's a valid value, and the start index isn't the current index, grab the whole value
                    splitLine.push(csv.substring(stateVariables.startIndex));
                }
                // Since the last character is a comma, there's still an additional implied field value trailing the comma.
                //   Since this value is empty, we push an extra empty value
                splitLine.push('');
                // Finally, push the split line values into the lines array and clear the split line
                lines.push(splitLine);
                splitLine = [];
                stateVariables.startIndex = index + eolDelimiterLength;
                stateVariables.parsingValue = true;
                stateVariables.insideWrapDelimiter = charAfter === options.delimiter.wrap;
            }
            else if (index === lastCharacterIndex && character === options.delimiter.field) {
                // If we reach the end of the CSV and the current character is a field delimiter
                // Parse the previously seen value and add it to the line
                const parsedValue = csv.substring(stateVariables.startIndex, index);
                splitLine.push(parsedValue);
                // Then add an empty string to the line since the last character being a field delimiter indicates an empty field
                splitLine.push('');
                lines.push(splitLine);
            }
            else if (index === lastCharacterIndex || nextNChar === options.delimiter.eol &&
                // if we aren't inside wrap delimiters or if we are but the character before was a wrap delimiter and we didn't just see two
                (!stateVariables.insideWrapDelimiter ||
                    stateVariables.insideWrapDelimiter && charBefore === options.delimiter.wrap && !stateVariables.justParsedDoubleQuote)) {
                // Otherwise if we reached the end of the line or csv (and current character is not a field delimiter)
                const toIndex = index !== lastCharacterIndex || charBefore === options.delimiter.wrap ? index : undefined;
                // Retrieve the remaining value and add it to the split line list of values
                splitLine.push(csv.substring(stateVariables.startIndex, toIndex));
                // Finally, push the split line values into the lines array and clear the split line
                lines.push(splitLine);
                splitLine = [];
                stateVariables.startIndex = index + eolDelimiterLength;
                stateVariables.parsingValue = true;
                stateVariables.insideWrapDelimiter = charAfter === options.delimiter.wrap;
            }
            else if (character === options.delimiter.wrap && charBefore === options.delimiter.field &&
                !stateVariables.insideWrapDelimiter && !stateVariables.parsingValue) {
                // If we reached a wrap delimiter after a comma and we aren't inside a wrap delimiter
                stateVariables.startIndex = index;
                stateVariables.insideWrapDelimiter = true;
                stateVariables.parsingValue = true;
                // If the next character(s) are an EOL delimiter, then skip them so we don't parse what we've seen as another value
                if (utils.getNCharacters(csv, index + 1, eolDelimiterLength) === options.delimiter.eol) {
                    index += options.delimiter.eol.length + 1; // Skip past EOL
                }
            }
            else if (charBefore === options.delimiter.field && character === options.delimiter.wrap && charAfter === options.delimiter.eol) {
                // We reached the start of a wrapped new field that begins with an EOL delimiter
                // Retrieve the remaining value and add it to the split line list of values
                splitLine.push(csv.substring(stateVariables.startIndex, index - 1));
                stateVariables.startIndex = index;
                stateVariables.parsingValue = true;
                stateVariables.insideWrapDelimiter = true;
                stateVariables.justParsedDoubleQuote = true;
                index += 1;
            }
            else if ((charBefore !== options.delimiter.wrap || stateVariables.justParsedDoubleQuote && charBefore === options.delimiter.wrap) &&
                character === options.delimiter.wrap && utils.getNCharacters(csv, index + 1, eolDelimiterLength) === options.delimiter.eol) {
                // If we reach a wrap which is not preceded by a wrap delim and the next character is an EOL delim (ie. *"\n)
                stateVariables.insideWrapDelimiter = false;
                stateVariables.parsingValue = false;
                // Next iteration will substring, add the value to the line, and push the line onto the array of lines
            }
            else if (character === options.delimiter.wrap && (index === 0 || utils.getNCharacters(csv, index - eolDelimiterLength, eolDelimiterLength) === options.delimiter.eol && !stateVariables.insideWrapDelimiter)) {
                // If the line starts with a wrap delimiter (ie. "*)
                stateVariables.insideWrapDelimiter = true;
                stateVariables.parsingValue = true;
                stateVariables.startIndex = index;
            }
            else if (character === options.delimiter.wrap && charAfter === options.delimiter.field && stateVariables.insideWrapDelimiter) {
                // If we reached a wrap delimiter with a field delimiter after it (ie. *",)
                splitLine.push(csv.substring(stateVariables.startIndex, index + 1));
                stateVariables.startIndex = index + 2; // next value starts after the field delimiter
                stateVariables.insideWrapDelimiter = false;
                stateVariables.parsingValue = false;
            }
            else if (character === options.delimiter.wrap && charBefore === options.delimiter.field &&
                !stateVariables.insideWrapDelimiter && stateVariables.parsingValue) {
                // If we reached a wrap delimiter with a field delimiter after it (ie. ,"*)
                splitLine.push(csv.substring(stateVariables.startIndex, index - 1));
                stateVariables.insideWrapDelimiter = true;
                stateVariables.parsingValue = true;
                stateVariables.startIndex = index;
            }
            else if (character === options.delimiter.wrap && charAfter === options.delimiter.wrap && index !== stateVariables.startIndex) {
                // If we run into an escaped quote (ie. "") skip past the second quote
                index += 2;
                stateVariables.justParsedDoubleQuote = true;
                continue;
            }
            else if (character === options.delimiter.field && charBefore !== options.delimiter.wrap &&
                charAfter !== options.delimiter.wrap && !stateVariables.insideWrapDelimiter &&
                stateVariables.parsingValue) {
                // If we reached a field delimiter and are not inside the wrap delimiters (ie. *,*)
                splitLine.push(csv.substring(stateVariables.startIndex, index));
                stateVariables.startIndex = index + 1;
            }
            else if (character === options.delimiter.field && charBefore === options.delimiter.wrap &&
                charAfter !== options.delimiter.wrap && !stateVariables.parsingValue) {
                // If we reached a field delimiter, the previous character was a wrap delimiter, and the
                //   next character is not a wrap delimiter (ie. ",*)
                stateVariables.insideWrapDelimiter = false;
                stateVariables.parsingValue = true;
                stateVariables.startIndex = index + 1;
            }
            // Otherwise increment to the next character
            index++;
            // Reset the double quote state variable
            stateVariables.justParsedDoubleQuote = false;
        }
        return lines;
    }
    /**
     * Retrieves the record lines from the split CSV lines and sets it on the params object
     */
    function retrieveRecordLines(params) {
        if (options.headerFields) { // This option is passed for instances where the CSV has no header line
            params.recordLines = params.lines;
        }
        else { // All lines except for the header line
            params.recordLines = params.lines.splice(1);
        }
        return params;
    }
    /**
     * Retrieves the value for the record from the line at the provided key.
     */
    function retrieveRecordValueFromLine(headerField, line) {
        // If there is a value at the key's index, use it; otherwise, null
        const value = line[headerField.index];
        // Perform any necessary value conversions on the record value
        return processRecordValue(value);
    }
    /**
     * Processes the record's value by parsing the data to ensure the CSV is
     * converted to the JSON that created it.
     */
    function processRecordValue(fieldValue) {
        // If the value is an array representation, convert it
        const parsedJson = parseValue(fieldValue);
        // If parsedJson is anything aside from an error, then we want to use the parsed value
        // This allows us to interpret values like 'null' --> null, 'false' --> false
        if (!utils.isError(parsedJson) && !utils.isInvalid(parsedJson)) {
            return parsedJson;
        }
        else if (fieldValue === 'undefined') {
            return undefined;
        }
        return fieldValue;
    }
    /**
     * Trims the record value, if specified by the user via the options object
     */
    function trimRecordValue(fieldValue) {
        if (options.trimFieldValues && fieldValue !== null) {
            return fieldValue.trim();
        }
        return fieldValue;
    }
    /**
     * Create a JSON document with the given keys (designated by the CSV header)
     *   and the values (from the given line)
     * @returns {Object} created json document
     */
    function createDocument(headerFields, line) {
        // Reduce the keys into a JSON document representing the given line
        return headerFields.reduce((document, headerField) => {
            // If there is a value at the key's index in the line, set the value; otherwise null
            const value = retrieveRecordValueFromLine(headerField, line);
            try {
                // Otherwise add the key and value to the document
                return (0, doc_path_1.setPath)(document, headerField.value, value);
            }
            catch (error) {
                // Catch any errors where key paths are null or '' and continue
                return document;
            }
        }, {});
    }
    /**
     * Removes the outermost wrap delimiters from a value, if they are present
     * Otherwise, the non-wrapped value is returned as is
     */
    function removeWrapDelimitersFromValue(fieldValue) {
        const firstChar = fieldValue[0], lastIndex = fieldValue.length - 1, lastChar = fieldValue[lastIndex];
        // If the field starts and ends with a wrap delimiter
        if (firstChar === options.delimiter.wrap && lastChar === options.delimiter.wrap) {
            // Handle the case where the field is just a pair of wrap delimiters 
            return fieldValue.length <= 2 ? '' : fieldValue.substring(1, lastIndex);
        }
        return fieldValue;
    }
    /**
     * Unescapes wrap delimiters by replacing duplicates with a single (eg. "" -> ")
     * This is done in order to parse RFC 4180 compliant CSV back to JSON
     */
    function unescapeWrapDelimiterInField(fieldValue) {
        return fieldValue.replace(escapedWrapDelimiterRegex, options.delimiter.wrap);
    }
    /**
     * Main helper function to convert the CSV to the JSON document array
     */
    function transformRecordLines(params) {
        // For each line, create the document and add it to the array of documents
        return params.recordLines.reduce((generatedJsonObjects, line) => {
            line = line.map((fieldValue) => {
                // Perform the necessary operations on each line
                fieldValue = removeWrapDelimitersFromValue(fieldValue);
                fieldValue = unescapeWrapDelimiterInField(fieldValue);
                fieldValue = trimRecordValue(fieldValue);
                return fieldValue;
            });
            const generatedDocument = createDocument(params.headerFields, line);
            return generatedJsonObjects.concat(generatedDocument);
        }, []);
    }
    /**
     * Attempts to parse the provided value. If it is not parsable, then an error is returned
     */
    function parseValue(value) {
        try {
            if (utils.isStringRepresentation(value, options) && !utils.isDateRepresentation(value)) {
                return value;
            }
            const parsedJson = valueParserFn(value);
            // If the parsed value is an array, then we also need to trim record values, if specified
            if (Array.isArray(parsedJson)) {
                return parsedJson.map(trimRecordValue);
            }
            return parsedJson;
        }
        catch (err) {
            return err;
        }
    }
    /**
     * Internally exported csv2json function
     */
    function convert(data) {
        // Split the CSV into lines using the specified EOL option
        const stripped = stripExcelBOM(data);
        const split = splitLines(stripped);
        const heading = retrieveHeading(split); // Retrieve the headings from the CSV, unless the user specified the keys
        const lines = retrieveRecordLines(heading); // Retrieve the record lines from the CSV
        return transformRecordLines(lines); // Retrieve the JSON document array
    }
    return {
        convert,
    };
};
exports.Csv2Json = Csv2Json;
